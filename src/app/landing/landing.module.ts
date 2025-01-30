import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { LandingRoutingModule } from './landing-routing.module';
import { LoginComponent } from './login/login.component';
import { OidcCallbackComponent } from './oidc-callback/oidc-callback.component';
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';

import { MaterialModule } from './material.module';

@NgModule({
  declarations: [
    LoginComponent,
    NotAuthorizedComponent,
    OidcCallbackComponent,
  ],
  imports: [
    LandingRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  providers: [
  ]
})
export class LandingModule { }