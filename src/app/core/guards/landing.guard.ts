import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class LandingGuard implements CanActivate {


  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}


  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (this.authenticationService.token) {
        this.router.navigate(['/home']);
      }
      else if(state.url == "/"){
        this.router.navigate(['/login']);
      }
      return true;
  }

}
