import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/authentication.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = this.authenticationService.idToken;

    if (token) {
      if (this.authenticationService.isTokenExpired(token)) {
        this.clearToken();
        this.logout(state);
        return false;
      }
      return true;
    } else {
      this.logout(state);
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

  logout(state: any) {
    this.setRedirectUrl(state.url);
    this.authenticationService.logout();
    window.parent.postMessage(
      {
        command: 'logoutComplete'
      },
      '*'
    );
  }
}
