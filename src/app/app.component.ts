import { Component, OnInit } from '@angular/core';
import { SharedNavigationService } from 'fastcode-shared-service';
import { ShellHelperService } from './services/shell-helper.service';
import { ShellExportBridgeService } from './services/shell-export-bridge.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  // encapsulation: ViewEncapsulation.ShadowDom
})
export class AppComponent implements OnInit {
  title: string = "";
  showMicrofrontend: boolean = false;

  ngOnInit() {
    this.sharedNavService.navigation$.subscribe((path: any) => {
      if (path) {
        this.sharedNavService.navigate(path);
      }
    });
    //handle add-on
    // // Listen for the response (optional here; handled in a service ideally)
    // window.addEventListener('message', (event) => {
    //   const message = event.data;
    //   if (message?.command === 'accelerator-files-required') {
    //     console.log('Files received from VS Code:', message.data);
    //     // handle/display response
    //   }
    // });
  }

  constructor(
    private sharedNavService: SharedNavigationService,
    private shellHelper: ShellHelperService,
    private shellExportBridgeService: ShellExportBridgeService
  ) {
    this.shellExportBridgeService.init();
    this.shellHelper.initLanguageSupport();
    this.shellHelper.subscribeToRouterEvents(
      () => (this.shellHelper.unloadAssets()),
      (remoteName) => {
        if (remoteName) {
          this.shellHelper.loadAssets(remoteName);
          this.showMicrofrontend = true;
        } else {
          this.shellHelper.unloadAssets();
        }
      }
    );
  }
}
