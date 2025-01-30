import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { throwError, Subject, Observable } from 'rxjs';
import { catchError, filter, map, takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from "@auth0/angular-jwt";
import { Router } from '@angular/router';
import { OidcSecurityService, ConfigurationService } from 'angular-auth-oidc-client';
// import { ITokenDetail } from '../models/itoken-detail';
// import { UserService } from 'src/app/user/user-service';
// import { PermissionService } from './permission.service';
import { CookieService } from './cookie.service';
import { PermissionService } from './permission.service';
import { ITokenDetail } from '../model/itoken-detail';

const API_URL = environment.apiUrl;
const helper = new JwtHelperService();


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  authChange: Subject<string> = new Subject<string>();
  private readonly _destroying$ = new Subject<void>();

  // private decodedToken: ITokenDetail;
  permissionsChange: Subject<string> = new Subject<string>();
  private apiUrl = API_URL;
  private _reqOptionsArgs = {
    withCredentials: true,
    headers: new HttpHeaders().set('Content-Type', 'application/json').append('Access-Control-Allow-Origin', '*')
  };


  private decodedToken: ITokenDetail = {};
  token = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    // private broadcastService: MsalBroadcastService,
    // private authService: MsalService,
    public oidcSecurityService: OidcSecurityService,
    // private userService: UserService,
    private permissionService: PermissionService,
    private cookieService: CookieService
  ) {
    // this.oidcSecurityService.userData$.subscribe(userData => {
    //   if (userData) {
    //     console.log('🔄 Token renewed:', userData);
    //     this.setLoggedInUserPermissions(userData?.userData?.idToken);
    //   }
    // });
  }

  configure() {
    this.oidcSecurityService.getAuthenticationResult().subscribe((res) => {
      if (res) {
        console.log("User Authorized");
        this.token = res?.id_token;
        // this.setLoggedInUserPermissions(res?.idToken);
      }
      else {
        console.error("Authorization failed");
        // this.router.navigate(['/not-authorized']);
      }
    });

  }

  private getQueryParamValue(param: string, url: string): string | null {
    const urlParams = new URLSearchParams(url.split('?')[1]);
    return urlParams.get(param);
  }

  login(user: any, redirectPath?: any) {
    this.oidcSecurityService.authorize();
  }

  logout() {
    localStorage.removeItem('permissions');
    localStorage.removeItem('Authorization');
    this.cookieService.delete('Authentication');
    this.oidcSecurityService.logoff();
  }
  getLoggedinUserId(): number | undefined {
    let token = localStorage.getItem('Authorization') || '';
    let decodedToken: ITokenDetail = this.decodePassedToken(token);
    return decodedToken?.id;
  }

  get authorizationToken(): string | null {
    const authToken = localStorage.getItem("Authorization") || '';
    if (this.isTokenExpired(authToken)) {
      localStorage.removeItem("Authorization");
      return null;
    }
    return authToken;
  }

  get idToken(): string | null {
    return this.token;
  }


  decodeToken(): ITokenDetail {
    if (this.decodedToken) {
      let permissions: string = localStorage.getItem("permissions") || '[]';
      this.decodedToken.scopes = JSON.parse(permissions) || [];
      return this.decodedToken;
    }
    else {
      if (this.token) {
        let decodedToken: ITokenDetail = helper.decodeToken(this.token) as ITokenDetail;
        let permissions: string = localStorage.getItem("permissions") || '[]';
        decodedToken.scopes = JSON.parse(permissions) || [];
        this.decodedToken = decodedToken;
        return this.decodedToken;
      }
      else
        return {};
    }
  }

  decodePassedToken(token: string): ITokenDetail {
    let decodedToken: ITokenDetail = helper.decodeToken(token) as ITokenDetail;
    return decodedToken;
  }


  setLoggedInUserPermissions(idToken: any) {
    if (idToken) {
      this.token = idToken;
      this.http.get<any>(this.apiUrl + '/auth/getAuthorizationToken').subscribe((token) => {
        console.log(token.token);
        const redirectUrl = sessionStorage.getItem("redirectUrl");
        if (redirectUrl) {
          sessionStorage.removeItem("redirectUrl");
          this.router.navigateByUrl(redirectUrl);
        }
        localStorage.setItem('Authorization', token.token);
        const decodedToken = this.decodePassedToken(token.token);
        const permissions = decodedToken ? decodedToken.scopes : [];
        localStorage.setItem('permissions', JSON.stringify(permissions));
        this.permissionService.refreshPermissions();
        this.permissionsChange.next('');
      }, this.handleError);
    }
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

  isTokenExpired(token?: string): boolean | undefined {
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
      // A client-side or network error occurred. Handle it accordingly.
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