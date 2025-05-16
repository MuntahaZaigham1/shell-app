import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from 'fastcode-shared-service';
import { ApplicationService } from '../applications/application.service';
import { Application, ApplicationMetadata } from '../applications/models/application';

@Injectable({
    providedIn: 'root'
})
export class InitializeToolsService {

    constructor(
        private router: Router,
        private toolsSharedService: SharedService,
        private appService: ApplicationService
    ) {
    }

    initializePortal(metadata: ApplicationMetadata) {
        console.log("metadata", metadata);
        if (metadata) {
            this.appService.getApplicationById(metadata?.id).subscribe((application: Application) => {
                this.router.navigate(['home']).then(() => {
                    localStorage.setItem("currentAppId", application?.id?.toString());
                    this.toolsSharedService.sendMessage({ command: "shell-application-metadata", payload: application, for: "all-tools" });
                })
            })
        }
        else {
            this.router.navigate(['applications'])
        }
    }

    sendAppDataToTools() {
        this.toolsSharedService.listenMessage(msg => {
            if (msg?.command == "getApplication" && msg?.for == "shell") {
                let appId = localStorage.getItem("currentAppId");
                this.appService.getApplicationById(appId ? Number(appId) : undefined).subscribe((application: Application) => {
                    this.toolsSharedService.sendMessage({ command: "shell-application-metadata", payload: application, for: "all-tools" });
                })
            }
        })
    }
}