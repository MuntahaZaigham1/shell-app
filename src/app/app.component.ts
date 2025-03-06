import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from './core/services/authentication.service';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { SharedNavigationService } from 'fastcode-shared-service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  // encapsulation: ViewEncapsulation.ShadowDom
})
export class AppComponent implements OnInit {
  title = 'shell-app';
  pageTitle = 'Shell'; // Default title
  currentRemoteStyles: string | null = null; // Track the active remote style

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private translate: TranslateService,
    private cd: ChangeDetectorRef,
    private sharedNavService: SharedNavigationService
  ) {
    translate.addLangs(["en", "fr"]);
    translate.setDefaultLang('en');
    let browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|fr/) ? browserLang : 'en').subscribe(() => {
      console.log('current language in shell', browserLang.match(/en|fr/) ? browserLang : 'en');
    });

  }

  changeTitle(title: string, urltoNavigate: string) {
    this.pageTitle = title;
    this.router.navigateByUrl(urltoNavigate);
  }

  showMicrofrontend = true;
  ngOnInit() {
    // this.authenticationService.configure();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.showMicrofrontend = false; // Remove old MF
      }
      if (event instanceof NavigationEnd) {
        const remoteName = this.extractRemoteName(event.url);
        if (remoteName) {
          this.loadRemoteStyles(remoteName);
        }
        setTimeout(() => this.showMicrofrontend = true, 0); // Render new MF
      }
      if (event) {
        console.log('Navigation:', event);
      }
    });
    this.sharedNavService.navigation$.subscribe((path: any) => {
      if (path) {
        this.sharedNavService.navigate(path);
      }
    });
  }

  private extractRemoteName(url: string): string | null {
    if (url.includes('/studio')) return 'studio';
    if (url.includes('/tool1')) return 'tool1';
    if (url.includes('/codegen')) return 'fast-code';
    return null;
  }


  loadRemoteStyles(remoteName: string) {
    const stylesMap: { [key: string]: string } = {
      'fast-code': 'https://127.0.0.1:4300/styles.css',
      'studio': 'http://localhost:4202/styles.css',
      'tool1': 'http://localhost:4201/styles.css',
    };

    Object.keys(stylesMap).filter(k => k != remoteName).forEach(key => {
      this.deleteRemoteStyles(key);
    });

    if (stylesMap[remoteName]) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = stylesMap[remoteName];
      link.id = `remote-styles-${remoteName}`;
      document.head.appendChild(link);
      this.currentRemoteStyles = remoteName; // Set the active remote style
    }
  }

  deleteRemoteStyles(remoteName: string) {
    const link = document.getElementById(`remote-styles-${remoteName}`);
    if (link) {
      link.remove();
    }
  }

  logoff() {
    this.authenticationService.logout();
  }
}
