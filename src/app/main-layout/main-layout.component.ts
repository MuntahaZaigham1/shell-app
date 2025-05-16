// main-layout.component.ts
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../core/services/authentication.service';
import { CookieService } from '../core/services/cookie.service';
import { InitializeToolsService } from '../services/initialize-tools.service';
import { ShellHelperService } from '../services/shell-helper.service';

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

    constructor(
        private router: Router,
        private authService: AuthenticationService,
        private cookieService: CookieService,
        private toolService: InitializeToolsService,
        private shellHelper: ShellHelperService
    ) {

        this.shellHelper.subscribeToRouterEvents(
            () => (this.showMicrofrontend = false),
            (remoteName) => {
                if (remoteName) {
                    this.shellHelper.loadAssets(remoteName);
                } else {
                    this.shellHelper.unloadAssets();
                }
                setTimeout(() => (this.showMicrofrontend = true), 0);
            }
        );
    }

    ngOnInit(): void {
        this.toolService.sendAppDataToTools();
    }

    changeTitle(title: string, url: string): void {
        this.pageTitle = title;
        this.router.navigateByUrl(url);
    }

    logoff(): void {
        this.cookieService.delete('Authentication');
        localStorage.removeItem('permissions');
        localStorage.removeItem('codegenPermissions');
        this.authService.logout();
    }
}
