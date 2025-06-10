// shell-helper.service.ts
import { Injectable } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ScriptLoadingService } from './script-loading.service';
import { StylesLoadingService } from './styles-loading.service';

@Injectable({ providedIn: 'root' })
export class ShellHelperService {
    constructor(
        private router: Router,
        private translate: TranslateService,
        private scriptLoader: ScriptLoadingService,
        private styleLoader: StylesLoadingService
    ) {}

    initLanguageSupport(): void {
        this.translate.addLangs(['en', 'fr']);
        this.translate.setDefaultLang('en');
        const browserLang = this.translate.getBrowserLang();
        this.translate
            .use(browserLang.match(/en|fr/) ? browserLang : 'en')
            .subscribe(() => console.log('current language in shell', browserLang));
    }

    subscribeToRouterEvents(
        onNavigationStart: () => void,
        onNavigationEnd: (remoteName: string | null) => void
    ): void {
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationStart) onNavigationStart();
            if (event instanceof NavigationEnd) {
                const remoteName = this.extractRemoteName(event.url);
                onNavigationEnd(remoteName);
            }
            if (event) console.log('Navigation:', event);
        });
    }

    private extractRemoteName(url: string): string | null {
        if (url.includes('/apiBuilder')) return 'apiBuilder';
        if (url.includes('/tool1')) return 'tool1';
        if (url.includes('/codegen')) return 'fast-code';
        if (url.includes('/ui')) return 'uibuilder';
        return null;
    }

    loadAssets(remoteName: string): void {
        this.styleLoader.loadRemoteStyles(remoteName);
        this.scriptLoader.loadRemoteScripts(remoteName);
    }

    unloadAssets(): void {
        this.styleLoader.deleteAllRemoteStyles();
        this.scriptLoader.deleteAllRemoteScripts();
    }
}
