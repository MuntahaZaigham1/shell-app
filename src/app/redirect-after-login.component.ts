import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './core/services/authentication.service';
import { VsCodeExtCommunicationService } from './services/vs-code-ext-communication.service';

@Component({
    selector: 'app-redirect-after-login',
    template: `<p>Redirecting...</p>`
})
export class RedirectAfterLoginComponent implements OnInit {
    projectCheckedOut: boolean = true;

    constructor(private vsCodeExtCommunicationService: VsCodeExtCommunicationService) { }

    ngOnInit(): void {
        this.vsCodeExtCommunicationService.initializeApplicationLoader();

        // // Replace this with your real logic, e.g., check roles, user profile, etc.
        // const user = this.authService.getLoggedinUserId(); // Assume this returns logged-in user object
        // if (this.projectCheckedOut) {
        //     this.router.navigate(['applications']);
        // }
        // else {
        //     this.router.navigate(['home'])
        // }
        // // if (user?.defaultTool === 'studio') {
        // //   this.router.navigate(['/studio']);
        // // } else {
        // //   this.router.navigate(['/projects']);
        // // }
    }
}
