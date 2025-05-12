import { NgModule } from '@angular/core';

import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { MaterialModule } from '../landing/material.module';
import { AssignUsersDialogComponent } from './assign-users-dialog/assign-users-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ProjectListComponent,
    ProjectDetailComponent,
    AssignUsersDialogComponent
  ],
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    ProjectsRoutingModule
  ]
})
export class ProjectsModule { }
