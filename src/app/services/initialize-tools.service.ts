import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from 'fastcode-shared-service';
import { ApplicationService } from '../applications/application.service';
import { Application, ApplicationMetadata } from '../applications/models/application';

@Injectable({
    providedIn: 'root'
})
export class InitializeToolsService {
    private appDataSent = false;
    private messageSubscription: any;

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
                    this.sendAppDataToTools();
                    // this.toolsSharedService.sendMessage({ command: "shell-application-metadata", payload: application, for: "all-tools" });
                })
            })
        }
        else {
            this.router.navigate(['applications'])
        }
    }

    sendAppDataToTools() {
        if (this.appDataSent) {
            return; // ✅ prevent repeated sends
        }
        this.appDataSent = true;

        // Clean up previous listener if exists
        if (this.messageSubscription) {
            this.messageSubscription.unsubscribe();
        }

        this.messageSubscription = this.toolsSharedService.listenMessage(msg => {
            if (msg?.command == "getApplication" && msg?.for == "shell") {
                let appId = localStorage.getItem("currentAppId");
                this.appService.getApplicationById(appId ? Number(appId) : undefined).subscribe((application: Application) => {
                    this.toolsSharedService.sendMessage({ command: "shell-application-metadata", payload: application, for: "all-tools" });
                })
            }
            if (msg?.command == "ui-builder-project-created" && msg?.for == "shell") {
                this.appService.getApplicationById(msg?.payload?.id ? Number(msg?.payload?.id) : undefined).subscribe((application: Application) => {
                    let updatedApplication = {
                        ...application
                    }
                    updatedApplication.uiBuilderClientId = msg?.payload?.uiBuilderClientId;
                    updatedApplication.uiBuilderProjectId = msg?.payload?.uiBuilderProjectId;
                    this.appService.updateApplication(msg?.payload?.id, updatedApplication).subscribe(res => {
                        console.log("application from uibuilder updated successfully!!")
                    })
                })

            }
        })
    }

    ngOnDestroy() {
        if (this.messageSubscription) {
            this.messageSubscription.unsubscribe();
        }
    }
}