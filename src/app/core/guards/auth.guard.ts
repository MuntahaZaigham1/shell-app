import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/authentication.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = this.authenticationService.idToken;
    if (token) {
      return true;
    } else {
      if (this.authenticationService.isVsCodeExtension()) {
        this.getNewToken();
      }
      else {
        this.setRedirectUrl(state.url);
        this.clearToken();
        this.authenticationService.logout();
      }
      return false;
    }
  }

  private clearToken(): void {
    sessionStorage.removeItem("Authentication");
    localStorage.removeItem("Authentication");
  }

  private setRedirectUrl(url: string): void {
    sessionStorage.setItem("redirectUrl", url);
  }

  getNewToken() {
    window.parent.postMessage({ command: 'getToken' }, '*');
  }
}
