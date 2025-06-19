import { NgModule } from '@angular/core';

import { MaterialModule } from '../landing/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApplicationListComponent } from './application-list/application-list.component';
import { ApplicationsRoutingModule } from './applications-routing.module';


@NgModule({
  declarations: [
    ApplicationListComponent
  ],
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    ApplicationsRoutingModule
  ]
})
export class ApplicationsModule { }
