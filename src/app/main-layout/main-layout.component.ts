import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from '../core/services/authentication.service';
import { CookieService } from '../core/services/cookie.service';
import { ScriptLoadingService } from '../services/script-loading.service';
import { StylesLoadingService } from '../services/styles-loading.service';


@Component({
    selector: 'main-layout-component',
    templateUrl: './main-layout.component.html',
    styleUrls: ['./main-layout.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class MainLayoutComponent implements OnInit {
    title = 'shell-app';
    pageTitle = 'Shell'; // Default title
    showMicrofrontend = true;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private translate: TranslateService,
        private cd: ChangeDetectorRef,
        private cookieService: CookieService,
        private scriptLoadingService: ScriptLoadingService,
        private stylesLoadingService: StylesLoadingService
    ) {
        translate.addLangs(["en", "fr"]);
        translate.setDefaultLang('en');
        let browserLang = translate.getBrowserLang();
        translate.use(browserLang.match(/en|fr/) ? browserLang : 'en').subscribe(() => {
            console.log('current language in shell', browserLang.match(/en|fr/) ? browserLang : 'en');
        });
        this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                this.showMicrofrontend = false; // Remove old MF
            }
            if (event instanceof NavigationEnd) {
                const remoteName = this.extractRemoteName(event.url);
                if (remoteName) {
                    this.stylesLoadingService.loadRemoteStyles(remoteName);
                    this.scriptLoadingService.loadRemoteScripts(remoteName);
                }
                else {
                    this.stylesLoadingService.deleteAllRemoteStyles();
                    this.scriptLoadingService.deleteAllRemoteScripts();
                }
                setTimeout(() => this.showMicrofrontend = true, 0); // Render new MF
            }
            if (event) {
                console.log('Navigation:', event);
            }
        });
    }

    changeTitle(title: string, urltoNavigate: string) {
        this.pageTitle = title;
        this.router.navigateByUrl(urltoNavigate);
    }

    ngOnInit() {
    }

    private extractRemoteName(url: string): string | null {
        if (url.includes('/studio')) return 'studio';
        if (url.includes('/tool1')) return 'tool1';
        if (url.includes('/codegen')) return 'fast-code';
        if (url.includes('/ui')) return 'uibuilder';
        return null;
    }

    logoff() {
        this.cookieService.delete('Authentication');
        localStorage.removeItem('permissions');
        localStorage.removeItem('codegenPermissions');
        this.authenticationService.logout();
    }
}
