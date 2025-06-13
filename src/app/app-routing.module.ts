import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingGuard } from './core/guards/landing.guard';
import { AuthGuard } from './core/guards/auth.guard';
import { loadRemoteModule } from '@angular-architects/module-federation';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { RedirectAfterLoginComponent } from './redirect-after-login.component';
import { HomeComponent } from './home/home.component';


const routes: Routes = [
  {
    path: "redirect-after-login",
    component: RedirectAfterLoginComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "",
    loadChildren: () => import("./landing/landing.module").then((m) => m.LandingModule),
    data: {
      from: "beforeLogin"
    },
    canActivate: [LandingGuard]
  },
  {
    path: "applications",
    loadChildren: () => import("./applications/applications.module").then((m) => m.ApplicationsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'codegen',
    loadChildren: () =>
      loadRemoteModule({
        type: 'manifest',
        remoteName: 'fast-code',
        exposedModule: './Module',
      }).then((m) => m.FastcodeModule),
      canActivate: [AuthGuard],
  },
  {
    path: "",
    component: MainLayoutComponent,
    children: [
      { path: "", redirectTo: "home", pathMatch: "full" },
      {
        path: "home", component: HomeComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'apiBuilder',
        loadChildren: () =>
          loadRemoteModule({
            type: 'manifest',
            remoteName: 'studio',
            exposedModule: './ApiBuilderModule',
          }).then((m) => m.ApiBuilderModule),
      },
      {
        path: 'ui',
        loadChildren: () =>
          loadRemoteModule({
            type: 'manifest',
            remoteName: 'uiBuilder',
            exposedModule: './Module',
          }).then((m) => m.UibuilderModule),
        canActivate: [AuthGuard],
      },
      {
        path: "core",
        loadChildren: () => import("./core/core.module").then((m) => m.CoreModule),
      },
      { path: '**', redirectTo: '', pathMatch: 'full' }
    ]
  },
];


@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
