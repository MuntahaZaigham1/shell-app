import { Component, OnInit } from '@angular/core';
import { SharedNavigationService } from 'fastcode-shared-service';
import { ShellHelperService } from './services/shell-helper.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  // encapsulation: ViewEncapsulation.ShadowDom
})
export class AppComponent implements OnInit {
  title: string = "";
  showMicrofrontend: boolean = false;

  addons = ['oidc', 'auth', 'logging', 'notificationApi', 'jobScheduler', 'integrationConnector', 'audit', 'emailTemplateBuilder', 'documentManagementApi', 'error']; // Extend as needed
  selectedProject = 'example'; // You can dynamically get this too

  ngOnInit() {
    this.sharedNavService.navigation$.subscribe((path: any) => {
      if (path) {
        this.sharedNavService.navigate(path);
      }
    });

    // Listen for the response (optional here; handled in a service ideally)
    window.addEventListener('message', async (event) => {
      const message = event.data;
      if (message?.command === 'accelerator-files-required') {
        const accelerator = message?.data?.accelerator;
        const zipBase64 = message?.data?.files?.zipBase64;

        if (typeof Blob === 'undefined') {
          console.error('Blob API not supported in this environment');
          return;
        }

        // Proceed with download
        const byteChars = atob(zipBase64);
        const byteNumbers = new Array(byteChars.length);
        for (let i = 0; i < byteChars.length; i++) {
          byteNumbers[i] = byteChars.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/zip' });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${accelerator}-files.zip`;
        document.body.appendChild(a);
        console.log("Triggering download for", a.download);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 100);
      }
    });
  }

  constructor(
    private sharedNavService: SharedNavigationService,
    private shellHelper: ShellHelperService,
  ) {
    this.shellHelper.initLanguageSupport();
    this.shellHelper.subscribeToRouterEvents(
      () => this.shellHelper.unloadAssets(),
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

  requestFiles(addon: string) {
    window.parent.postMessage({
      command: 'get-accelerator-files',
      payload: {
        accelerator: addon,
        projectName: this.selectedProject
      }
    }, '*');
  }
}

function base64ToBlob(base64: string, mime: string): Blob {
  const byteChars = atob(base64);
  const byteArrays = [];

  for (let offset = 0; offset < byteChars.length; offset += 512) {
    const slice = byteChars.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);

    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    byteArrays.push(new Uint8Array(byteNumbers));
  }

  return new Blob(byteArrays, { type: mime });
}
