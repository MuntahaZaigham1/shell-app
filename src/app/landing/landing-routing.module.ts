import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';

import { OidcCallbackComponent } from './oidc-callback/oidc-callback.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'callback', component: OidcCallbackComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingRoutingModule { }