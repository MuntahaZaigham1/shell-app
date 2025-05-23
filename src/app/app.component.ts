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
  }

  constructor(
    private sharedNavService: SharedNavigationService,
    private shellHelper: ShellHelperService,
    private shellExportBridgeService: ShellExportBridgeService
  ) {
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
