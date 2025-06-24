// main-layout.component.ts
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../core/services/authentication.service';
import { CookieService } from '../core/services/cookie.service';
import { InitializeToolsService } from '../services/initialize-tools.service';
import { ShellHelperService } from '../services/shell-helper.service';
import { ApplicationService } from '../applications/application.service';
import { Application } from '../applications/models/application';

@Component({
    selector: 'main-layout-component',
    templateUrl: './main-layout.component.html',
    styleUrls: ['./main-layout.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class MainLayoutComponent implements OnInit {
    title = 'shell-app';
    pageTitle = 'Shell';
    showMicrofrontend = true;
    remoteCssClass = '';

    constructor(
        private router: Router,
        private authService: AuthenticationService,
        private cookieService: CookieService,
        private shellHelper: ShellHelperService,
        private applicationService: ApplicationService
    ) {

        this.shellHelper.subscribeToRouterEvents(
            () => {
                this.showMicrofrontend = false;
                this.remoteCssClass = '';
            },
            (remoteName) => {
                if (remoteName) {
                    this.remoteCssClass = remoteName; // This will be applied to the div
                    this.shellHelper.loadAssets(remoteName);
                } else {
                    this.remoteCssClass = '';
                    this.shellHelper.unloadAssets();
                }
                setTimeout(() => (this.showMicrofrontend = true), 0);
            }
        );
    }

    ngOnInit(): void {
    }

    changeTitle(title: string, url: string): void {
        this.pageTitle = title;
        this.router.navigateByUrl(url);
    }

    openDomainTool() {
        let currentAppId: number = Number(localStorage.getItem("currentAppId"));
        this.applicationService.getApplicationById(currentAppId).subscribe((app: Application) => {
            if (app) {
                let codegenID = app.codegenProjectId;
                if (codegenID) {
                    this.router.navigate([`/codegen/fastcode/create-app/1`], {
                        queryParams: { appId: codegenID }
                    });
                }
            }
        })
    }

    logoff(): void {
        this.cookieService.delete('Authentication');
        localStorage.removeItem('permissions');
        localStorage.removeItem('codegenPermissions');
        this.authService.logout();
    }
}
