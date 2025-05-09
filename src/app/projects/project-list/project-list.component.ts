import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectService } from '../project.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { Project } from '../models/project';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  projects: Project[] = [];
  loading = false;

  constructor(
    private projectService: ProjectService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.loading = true;
    this.projectService.getProjects().subscribe({
      next: (res) => (this.projects = res),
      error: () => this.snackBar.open('Error loading projects', 'Close'),
      complete: () => (this.loading = false)
    });
  }

  openAssignDialog(project: any): void {
    // this.dialog.open(AssignUsersDialogComponent, {
    //   data: { project }
    // }).afterClosed().subscribe(reload => reload && this.loadProjects());
  }
  

  toggleLock(project: Project, lock: boolean): void {
    const userId: any = this.authenticationService.getLoggedinUserId(); // Replace with current user ID
    this.projectService.toggleLock(project.projectId, userId, lock).subscribe({
      next: () => {
        this.snackBar.open(`Project ${lock ? 'locked' : 'unlocked'}`, 'Close');
        this.loadProjects();
      },
      error: () => this.snackBar.open('Error updating lock state', 'Close')
    });
  }
}