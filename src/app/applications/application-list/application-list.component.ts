import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { AssignUsersDialogComponent } from '../assign-users-dialog/assign-users-dialog.component';
import { Application } from '../models/application';
import { ApplicationService } from '../application.service';
import { Router } from '@angular/router';
import { InitializeToolsService } from 'src/app/services/initialize-tools.service';
import { SharedService } from 'fastcode-shared-service';

@Component({
  selector: 'app-application-list',
  templateUrl: './application-list.component.html',
  styleUrls: ['./application-list.component.scss']
})
export class ApplicationListComponent implements OnInit {
  applications: Application[] = [];
  loading = false;

  constructor(
    private appService: ApplicationService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private authenticationService: AuthenticationService,
    private initializeToolsService: InitializeToolsService,
    private sharedService: SharedService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadApps();
    this.sharedService.listenMessage(msg=>{
      if(msg?.command == "application-creation-cancelled" && msg?.for=="shell") {
        const metadataId = msg?.payload?.id;
        this.appService.deleteAppByid(metadataId)?.subscribe(()=>{
          console.log("app-deleted");
        })
      }
    })
  }

  loadApps(): void {
    this.loading = true;
    this.appService.getApplications().subscribe({
      next: (res) => (this.applications = res),
      error: () => this.snackBar.open('Error loading applications', 'Close'),
      complete: () => (this.loading = false)
    });
  }

  openAssignDialog(app: any): void {
    this.dialog.open(AssignUsersDialogComponent, {
      data: { app }
    }).afterClosed().subscribe(reload => reload && this.loadApps());
  }
  

  toggleLock(application: Application, lock: boolean): void {
    const userId: any = this.authenticationService.getLoggedinUserId(); // Replace with current user ID
    this.appService.toggleLock(application.id, userId, lock).subscribe({
      next: () => {
        this.snackBar.open(`Application ${lock ? 'locked' : 'unlocked'}`, 'Close');
        this.loadApps();
      },
      error: () => this.snackBar.open('Error updating lock state', 'Close')
    });
  }

  checkoutFromGit(app: Application) {
    window.parent.postMessage({command: "checkoutAppFromGit", data: app}, '*');
  }

  openFromLocal(app: Application) {
    window.parent.postMessage({command: "checkoutAppFromLocal", data: app}, '*');
  }

  openTools(app: Application) {
    //assuming that this project is already opened in the vscode window and user just wants to open the tools
    this.initializeToolsService.initializePortal({id: app?.id, name: app?.name})
  }

  createNewApplication() { 
    //whenever create a new application from codegen set set uibuilder client id (any random id)
    this.router.navigate(['/codegen/fastcode/create-app/1']); 
    // this.appService.createApplication('changemyname').subscribe({
    //   next: (createdApp) => {
    //     this.applications.push(createdApp); // Optionally refresh list from API instead
    //   },
    //   error: (err) => {
    //     console.error('Failed to create application', err);
    //   }
    // });
  }
  
}