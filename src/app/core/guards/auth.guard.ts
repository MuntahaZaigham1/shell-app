import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
  ) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authenticationService.token) {
      if (this.authenticationService.isTokenExpired(this.authenticationService.token)) {
        localStorage.removeItem("Authentication");
        sessionStorage.setItem("redirectUrl", state.url);  // Only store if not logged in
        this.router.navigate(['/not-authorized'], { queryParams: { returnUrl: state.url } });
        return false;
      }
      return true;
    }
    else {
      sessionStorage.setItem("redirectUrl", state.url);  // Only store if not logged in
      this.router.navigate(['/not-authorized'], { queryParams: { returnUrl: state.url } });
      return false;
    }
  }
}
