import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingGuard } from './core/guards/landing.guard';
import { AppModule } from './app.module';
import { AuthGuard } from './core/guards/auth.guard';
import { TestComponent } from './test/test.component';

const routes: Routes = [
  // {
  //   path: 'studio',
  //   loadChildren: () => import('studio/Module').then((m) => m.AppModule)
  // },
  {
    path: "",
    loadChildren: () =>
      import("./landing/landing.module").then((m) => m.LandingModule),
    data: { from: "beforeLogin" },
    canActivate: [LandingGuard],
  },
  {
    path: "core",
    loadChildren: () => import("./core/core.module").then((m) => m.CoreModule),
  },
  {
    path: "home", component: TestComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
