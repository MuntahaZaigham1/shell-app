import { NgModule } from '@angular/core';

import { MaterialModule } from '../landing/material.module';
import { AssignUsersDialogComponent } from './assign-users-dialog/assign-users-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApplicationListComponent } from './application-list/application-list.component';
import { ApplicationsRoutingModule } from './applications-routing.module';


@NgModule({
  declarations: [
    ApplicationListComponent,
    AssignUsersDialogComponent
  ],
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    ApplicationsRoutingModule
  ]
})
export class ApplicationsModule { }
