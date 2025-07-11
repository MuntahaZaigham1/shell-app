import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Application } from '../models/application';
import { ApplicationService } from '../application.service';
import { Router } from '@angular/router';
import { InitializeToolsService } from 'src/app/services/initialize-tools.service';
import { SharedService } from 'fastcode-shared-service';
let isShellListenerRegistered = false;

@Component({
  selector: 'app-application-list',
  templateUrl: './application-list.component.html',
  styleUrls: ['./application-list.component.scss']
})
export class ApplicationListComponent implements OnInit, OnDestroy {
  applications: Application[] = [];
  loading = false;
  hoveredApp: Application | null = null;

  ngOnInit(): void {
    this.loadApps();
    if (!isShellListenerRegistered) {
      this.initializeMessageListener();
      isShellListenerRegistered = true;
    }
  }

  constructor(
    private appService: ApplicationService,
    private initializeToolsService: InitializeToolsService,
    private sharedService: SharedService,
    private router: Router
  ) { }

  initializeMessageListener(): void {
    this.sharedService.listenMessage(msg => {
      if (msg?.command == "application-creation-cancelled" && msg?.for == "shell") {
        const metadataId = msg?.payload?.id;
        this.appService.deleteAppByid(metadataId)?.subscribe(() => {
          console.log("app-deleted");
        })
      }
      else if (msg?.command == "codegen-application-created-base" && msg?.for == "shell" && !isShellListenerRegistered) {
        const metadata = msg.payload.metadata;
        const zipBlob = msg.payload.zipData;
        const application: Application = {
          name: metadata?.name,
          codegenProjectId: metadata?.id,
          githubUrl: metadata.githubRepository
        }
        isShellListenerRegistered = true;
        console.log("createApplication is called", metadata?.name, isShellListenerRegistered);
        this.appService.createApplication(metadata?.name).subscribe((createdApp: Application) => {
          this.appService.updateApplication(createdApp?.id, application).subscribe(updatedApp => {
            window.parent.postMessage({
              command: 'upload-application-to-git',
              payload: {
                application: updatedApp,
                githubRepository: metadata.githubRepository,
                zip: zipBlob
              }
            }, '*');

            this.loadApps();
          })
        })
      }
    })
  }

  loadApps(): void {
    this.loading = true;
    this.appService.getApplications().subscribe({
      next: (res) => (this.applications = res),
      complete: () => (this.loading = false)
    });
  }

  checkoutFromGit(app: Application) {
    window.parent.postMessage({ command: "checkoutAppFromGit", data: app }, '*');
  }

  openFromLocal(app: Application) {
    window.parent.postMessage({ command: "checkoutAppFromLocal", data: app }, '*');
  }

  openTools(app: Application) {
    this.initializeToolsService.initializePortal({ id: app?.id, name: app?.name })
  }

  createNewApplication() {
    this.router.navigate(['/codegen/fastcode/create-app/1']);
  }

  ngOnDestroy(): void {
    isShellListenerRegistered = false;
  }

  getShortGitUrl(fullUrl: string): string {
  try {
    const url = new URL(fullUrl);
    return url.hostname + url.pathname;
  } catch {
    return fullUrl;
  }
}
}