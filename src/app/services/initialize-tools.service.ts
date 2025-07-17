import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from 'fastcode-shared-service';
import { ApplicationService } from '../applications/application.service';
import { Application } from '../applications/models/application';
import { ShellExportBridgeService } from './shell-export-bridge.service';

@Injectable({
    providedIn: 'root'
})
export class InitializeToolsService {
    private appDataSent = false;
    private messageSubscription: any;

    constructor(
        private router: Router,
        private toolsSharedService: SharedService,
        private appService: ApplicationService,
        // private shellExportBridge: ShellExportBridgeService
    ) {
    }

    initializePortal(metadata: any) {
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

    sendZipToDomainTool(zipdata: any) {
        this.toolsSharedService.sendMessage({
            command: "user-workspace-project-zip",
            for: "codegen",
            payload: {
                zipData: zipdata
            }
        })
    }
    sendZipToAddonsTool(data: any) {
        this.toolsSharedService.sendMessage({
            command: "addons-files-required",
            for: "codegen",
            payload: data
        })
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
            if (msg?.command == "get-user-workspace-project" && msg?.for == "shell") {
                window.parent.postMessage({
                    command: "get-workspace-project-ext"
                }, "*");  // Send to VS Code extension
            }
            if (msg?.command == "get-addons-files" && msg?.for == "shell") {
                window.parent.postMessage({
                    command: "get-accelerator-files",
                    payload: msg?.payload
                }, "*");  // Send to VS Code extension
            }
            if (msg?.command == "codegen-application-created-domain" && msg?.for == "shell") {
                window.parent.postMessage({
                    command: "codegen-application-created-domain-zip",
                    payload: msg.payload
                }, "*");  // Send to VS Code extension
            }
            if (msg?.command == "export-add-ons-files" && msg?.for == "shell") {
                console.log("export-add-ons-files-zip", msg?.payload);
                window.parent.postMessage({
                    command: "export-add-ons-files-zip",
                    payload: msg.payload
                }, "*");  // Send to VS Code extension
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
            if (msg?.command == "api-builder-project-created" && msg?.for == "shell") {
                this.appService.getApplicationById(msg?.payload?.id ? Number(msg?.payload?.id) : undefined).subscribe((application: Application) => {
                    let updatedApplication = {
                        ...application
                    }
                    updatedApplication.apiBuilderProjectId = msg?.payload?.apiBuilderProjectId;
                    this.appService.updateApplication(msg?.payload?.id, updatedApplication).subscribe(res => {
                        console.log("application from apibuilder updated successfully!!")
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