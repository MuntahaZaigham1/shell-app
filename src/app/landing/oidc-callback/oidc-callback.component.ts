import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { AuthenticationService } from 'src/app/core/services/authentication.service';

@Component({
	template: ''
})
export class OidcCallbackComponent {
	constructor(
		private oidcSecurityService: OidcSecurityService,
		private authService: AuthenticationService,
		private router: Router
	) {
		this.oidcSecurityService.checkAuthIncludingServer().subscribe(({ isAuthenticated, idToken }) => {
			if (isAuthenticated) {
				console.log('User is authenticated');
				this.authService.setLoggedInUserPermissions(idToken);
				// this.router.navigate([window.location.toString()]);
			} else {
				this.router.navigate(['not-authorized']);
			}
		});
	}
}