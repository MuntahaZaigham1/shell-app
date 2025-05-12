import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { AssignUsersDialogComponent } from '../assign-users-dialog/assign-users-dialog.component';
import { Application } from '../models/application';
import { ApplicationService } from '../application.service';

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
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.loadApps();
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
}