import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingGuard } from './core/guards/landing.guard';
import { HomeComponent } from './home.component';

const routes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("./landing/landing.module").then((m) => m.LandingModule),
    data: { from: "beforeLogin" },
    canActivate: [LandingGuard],
  },
  {
    path: "home",
    component: HomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
