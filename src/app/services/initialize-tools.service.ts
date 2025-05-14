import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class InitializeToolsService {

    constructor(
        private router: Router
    ) {
    }

    initializePortal(metadata: any) {
        console.log("metadata", metadata);
        if(metadata) {
            this.router.navigate(['home'])
        }
        else {
            this.router.navigate(['applications'])
        }
    }
}