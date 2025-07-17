import { ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Application } from '../models/application';
import { ApplicationService } from '../application.service';
import { Router } from '@angular/router';
import { InitializeToolsService } from 'src/app/services/initialize-tools.service';
import { SharedService } from 'fastcode-shared-service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Subject, takeUntil } from 'rxjs';
let isShellListenerRegistered = false;

@Component({
  selector: 'app-application-list',
  templateUrl: './application-list.component.html',
  styleUrls: ['./application-list.component.scss']
})
export class ApplicationListComponent implements OnInit, OnDestroy {
  applications: Application[] = [];
  loading = false;
  uploading = false;
  hoveredApp: Application | null = null;
  private uploadStatus$ = new Subject<boolean>();
  private destroy$ = new Subject<void>();

  @ViewChild('deleteDialog') deleteDialog!: TemplateRef<any>;

  private setupUploadStatusListener(): void {
    this.uploadStatus$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(uploading => {
      this.uploading = uploading;
      this.cd.detectChanges();
    });
  }

  ngOnInit(): void {

    this.setupUploadStatusListener();
    this.loadApps();
    if (!isShellListenerRegistered) {
      this.initializeMessageListener();
      window.addEventListener('message', (event) => {
        if (event?.data?.command === 'uploadedApplicationToGit') {
          // this.uploading = false;
          this.uploadStatus$.next(false);
          this.loadApps();
          console.log("msg recv from extension, uploadedApplicationToGit");
        }
      })
      isShellListenerRegistered = true;
    }
  }

  constructor(
    private appService: ApplicationService,
    private initializeToolsService: InitializeToolsService,
    private sharedService: SharedService,
    private router: Router,
    public dialog: MatDialog,
    private cd: ChangeDetectorRef
    // private spinner: MatProgressSpinner
  ) {
  }

  initializeMessageListener(): void {
    this.sharedService.listenMessage(msg => {
      if (msg?.command == "application-creation-cancelled" && msg?.for == "shell") {
        const metadataId = msg?.payload?.id;
        this.appService.deleteAppByid(metadataId)?.subscribe(() => {
          console.log("app-deleted");
        })
      }
      else if (msg?.command == "codegen-application-created-base" && msg?.for == "shell") {
        // this.uploading = true;
        if (!isShellListenerRegistered) {
          this.uploadStatus$.next(true);
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
              // this.loadApps();
            })
          })
        }
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

  openDeleteDialog(app: Application): void {
    if (!this.deleteDialog) {
      console.error('deleteDialog TemplateRef is not available');
      return;
    }

    const dialogRef = this.dialog.open(this.deleteDialog, {
      width: '300px',
      data: { appName: app.name }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Placeholder for API call to delete the application
        console.log('Delete confirmed for app:', app.name);
        // Add API call here later, e.g., this.appService.deleteApplication(app.id).subscribe(() => this.loadApps());
      }
    });
  }
}