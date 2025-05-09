import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './core/services/authentication.service';

@Component({
    selector: 'app-redirect-after-login',
    template: `<p>Redirecting...</p>`
})
export class RedirectAfterLoginComponent implements OnInit {
    projectCheckedOut: boolean = true;

    constructor(private router: Router, private authService: AuthenticationService) { }

    ngOnInit(): void {
        // Replace this with your real logic, e.g., check roles, user profile, etc.
        const user = this.authService.getLoggedinUserId(); // Assume this returns logged-in user object
        if (this.projectCheckedOut) {
            this.router.navigate(['projects']);
        }
        else {
            this.router.navigate(['home'])
        }
        // if (user?.defaultTool === 'studio') {
        //   this.router.navigate(['/studio']);
        // } else {
        //   this.router.navigate(['/projects']);
        // }
    }
}
