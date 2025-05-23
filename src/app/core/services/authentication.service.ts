import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { throwError, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from "@auth0/angular-jwt";
import { Router } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { CookieService } from './cookie.service';
import { PermissionService } from './permission.service';
import { ITokenDetail } from '../model/itoken-detail';
import { SharedService } from 'fastcode-shared-service';

const API_URL = environment.apiUrl;
const helper = new JwtHelperService();


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  authChange: Subject<string> = new Subject<string>();
  private readonly _destroying$ = new Subject<void>();

  permissionsChange: Subject<string> = new Subject<string>();
  private apiUrl = API_URL;

  private decodedToken: ITokenDetail = {};
  token = '';
  // private sharedService;
  constructor(
    private http: HttpClient,
    private router: Router,
    public oidcSecurityService: OidcSecurityService,
    private permissionService: PermissionService,
    private cookieService: CookieService,
    // private injector: Injector
    private sharedService: SharedService
  ) {
    // this.sharedService =  new SharedService(window);
  }

  public isVsCodeExtension(): boolean {
    return window.parent !== window;
  }

  public initializeTokenListener(): void {
    window.addEventListener('message', (event) => {
      console.log("shell recved a msg from iframe");
      if (event.data?.command === 'setToken') {
        if (event?.data?.token) {
          this.initializeAuth(event.data.token);
        }
      }
      if (event.data?.command === 'sessionCleared') {
        this.logout();
        console.log("shell logging out -sending msg to uibuilder");
        this.sharedService.sendMessage({ command: "shell-logged-out", for: "allTools" });
        console.log("shell logging out -sent msg to uibuilder");
      }
    });

    this.sharedService.listenMessage(msg => {
      console.log("shell recved a msg from uibuilder", msg);
      if (msg.command === "token-expired" && msg.for === "shell") {
        console.log("shell sending msg back to iframe/webview", msg);
        window.parent.postMessage(
          {
            command: 'getToken'
          },
          '*'
        );
      }
    })

    // setTimeout(() => {
    //   if (!this.token) {
    //     window.parent.postMessage({ command: 'requestToken' }, '*');
    //   }
    // }, 2000);

    window.parent.postMessage({ command: 'getStoredToken' }, '*');
  }

  configure() {
    this.oidcSecurityService.getAuthenticationResult().subscribe((res) => {
      if (res) {
        this.token = res?.id_token;
      } else {
        console.error("Authorization failed");
      }
    });
  }

  login(user: any, redirectPath?: any) {
    this.oidcSecurityService.authorize();
  }

  logout() {
    localStorage.clear();
    sessionStorage.clear();
    this.cookieService.delete('Authentication');
    if (!this.isVsCodeExtension()) {
      this.oidcSecurityService.logoff();
    }
  }

  getLoggedinUserId(): number | undefined {
    let token = this.authorizationToken;
    let decodedToken: ITokenDetail = this.decodePassedToken(token);
    return decodedToken?.id;
  }

  get authorizationToken(): string | null {
    const authToken = sessionStorage.getItem("Authorization") || '';
    if (this.isTokenExpired(authToken)) {
      sessionStorage.removeItem("Authorization");
      return null;
    }
    return authToken;
  }

  get idToken(): string | null {
    const token = this.isVsCodeExtension() ? sessionStorage.getItem("Authentication") : this.cookieService.get('Authentication');
    if (this.isTokenExpired(token) && this.isVsCodeExtension()) {
      return null;
    }
    if (this.isTokenExpired(token) && !this.isVsCodeExtension()) {
      sessionStorage.removeItem("Authentication");
      this.cookieService.delete('Authentication');
      return null;
    }
    return token;
  }

  set idToken(token: string | null) {
    this.token = token || '';
    if (this.isVsCodeExtension()) {
      sessionStorage.setItem("Authentication", token || '');
    }
    else {
      this.cookieService.set('Authentication', this.token);
    }
  }

  decodeToken(): ITokenDetail {
    if (this.decodedToken) {
      let permissions: string = localStorage.getItem("permissions") || '[]';
      this.decodedToken.scopes = JSON.parse(permissions) || [];
      return this.decodedToken;
    } else {
      const currentToken = this.idToken;
      if (currentToken) {
        let decodedToken: ITokenDetail = helper.decodeToken(currentToken) as ITokenDetail;
        let permissions: string = localStorage.getItem("permissions") || '[]';
        decodedToken.scopes = JSON.parse(permissions) || [];
        this.decodedToken = decodedToken;
        return this.decodedToken;
      } else {
        return {};
      }
    }
  }

  decodePassedToken(token: any): ITokenDetail {
    let decodedToken: ITokenDetail = helper.decodeToken(token) as ITokenDetail;
    return decodedToken;
  }

  initializeAuth(idToken: string | null) {
    if (idToken) {
      if (!idToken.startsWith("Bearer_")) {
        idToken = "Bearer_" + idToken;
      }
      this.token = idToken;
      this.idToken = this.token;
      this.getAuthorizationCode();
    }
  }

  getAuthorizationCode() {
    this.http.get<any>(this.apiUrl + '/auth/getAuthorizationToken').subscribe((token) => {
      const redirectUrl = sessionStorage.getItem("redirectUrl");
      sessionStorage.removeItem("redirectUrl");
      if (redirectUrl) {
        this.router.navigateByUrl(redirectUrl);
      }
      sessionStorage.setItem('Authorization', token.token);
      const decodedToken = this.decodePassedToken(token.token);
      const permissions = decodedToken ? decodedToken.scopes : [];
      localStorage.setItem('permissions', JSON.stringify(permissions));
      this.permissionService.refreshPermissions();
      this.permissionsChange.next('');
      if (!redirectUrl && this.isVsCodeExtension()) {
        // this.router.navigate(['projects']);
        this.router.navigate(['redirect-after-login']);
      }
    }, this.handleError);
  }

  getTokenExpirationDate(token: string): Date | null {
    const decoded = helper.decodeToken(token);
    if (decoded.exp === undefined) {
      return null;
    }
    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  isTokenExpired(token?: string | null): boolean | undefined {
    if (!token) {
      return true;
    }
    const date: Date | null = this.getTokenExpirationDate(token);
    if (date === undefined) {
      return false;
    }
    return date ? !(date?.valueOf() > new Date().valueOf()) : undefined;
  }

  private handleError(err: HttpErrorResponse) {
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return throwError(err.message);
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
