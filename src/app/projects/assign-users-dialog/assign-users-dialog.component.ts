import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProjectService } from '../project.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Project } from '../models/project';
import { BehaviorSubject, finalize, Observable, tap } from 'rxjs';

@Component({
    selector: 'app-assign-users-dialog',
    templateUrl: './assign-users-dialog.component.html',
    styleUrls: ['./assign-users-dialog.component.scss']
})
export class AssignUsersDialogComponent implements OnInit {
    form: FormGroup;
    users: any[] = [];
    loading = false;
    project: Project;
    userList$: Observable<any[]> = new Observable();

    constructor(
        private dialogRef: MatDialogRef<AssignUsersDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private fb: FormBuilder,
        private projectService: ProjectService,
        private snackBar: MatSnackBar
    ) {
        this.form = this.fb.group({
            assignedUsers: [[]]
        });
        this.project = this.data?.project;
    }


    ngOnInit(): void {
        this.userList$ = this.projectService.getAllUsers().pipe(
            tap((users) => {
                this.users = users;

                const assignedUsers = (this.project.assignedUsers || [])
                    .map((assigned: any) => users.find((u: any) => u.id === assigned.id))
                    .filter(Boolean);  // remove undefined entries if any

                this.form.patchValue({ assignedUsers });
            }),
            finalize(() => this.loading = false)
        );
    }

    isUserAssigned(userId: number): boolean {
        return (this.project.assignedUsers || []).some(u => u.id === userId);
    }


    save(): void {
        const selectedUserIds = this.form.value.assignedUsers;
        this.projectService.assignUsers(this.project.id, selectedUserIds).subscribe({
            next: () => {
                this.snackBar.open('Users assigned successfully', 'Close');
                this.dialogRef.close(true);
            },
            error: () => this.snackBar.open('Failed to assign users', 'Close')
        });
    }

    cancel(): void {
        this.dialogRef.close(false);
    }
}