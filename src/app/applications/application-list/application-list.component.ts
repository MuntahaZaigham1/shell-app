import { ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Application } from '../models/application';
import { ApplicationService } from '../application.service';
import { Router } from '@angular/router';
import { InitializeToolsService } from 'src/app/services/initialize-tools.service';
import { SharedService } from 'fastcode-shared-service';
import { PermissionService } from 'src/app/core/services/permission.service';
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
  hoveredApp: Application | null = null;
  private destroy$ = new Subject<void>();

  @ViewChild('deleteDialog') deleteDialog!: TemplateRef<any>;
  dialogRef!: MatDialogRef<any>;

  constructor(
    private appService: ApplicationService,
    private initializeToolsService: InitializeToolsService,
    private sharedService: SharedService,
    private router: Router,
    public dialog: MatDialog,
    public permissionService: PermissionService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadApps();
    if (!isShellListenerRegistered) {
      this.initializeMessageListener();
      window.addEventListener('message', (event) => {
        if (event?.data?.command === 'uploadedApplicationToGit') {
          this.loadApps();
          console.log("msg recv from extension, uploadedApplicationToGit");
          this.router.navigate(['/applications']);
        }
      })
      isShellListenerRegistered = true;
    }
  }

  initializeMessageListener(): void {
    this.sharedService.listenMessage(msg => {
      // Ignore messages not intended for shell
      if (msg?.for !== "shell") {
        console.log("Ignoring message not for shell:", msg);
        return;
      }
      if (msg?.command == "application-creation-cancelled") {
        const metadataId = msg?.payload?.id;
        this.appService.deleteAppByid(metadataId)?.subscribe(() => {
          console.log("app-deleted");
        })
      }
      else if (msg?.command == "codegen-application-created-base" && msg?.for == "shell") {
        if (!isShellListenerRegistered) {
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
              this.sharedService.sendMessage({
                command: "application-created-received-by-shell",
                for: "codegen"
              });
            })
          })
        }
      }
    });
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
    localStorage.setItem('currentAppId', app.id.toString());
    this.initializeToolsService.initializePortal({ id: app?.id, name: app?.name });
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

    this.dialogRef = this.dialog.open(this.deleteDialog, {
      width: '400px',
      data: { appName: app.name, id: app.id }
    });
  }

  deleteApplication(id: number, appName: string): void {
    this.appService.deleteAppByid(id).subscribe({
      next: () => {
        this.loadApps();
        this.dialogRef.close();
        this.snackBar.open(`Application "${appName}" deleted successfully`, 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      },
      error: (err) => {
        console.error('Error deleting application:', err);
        this.snackBar.open('Failed to delete application', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  openEditDialog(app: Application): void {
    //   localStorage.setItem('currentAppId', app.id.toString());
    //   let codegenID = app.codegenProjectId;
    //               if (codegenID) {
    //                 const shellPrefix = 'fastcode';
    //                 this.router.navigate([`/codegen/fastcode/edit-application`], {
    //                        queryParams: { appId: codegenID }
    //                     })
    //               }

  }
}
