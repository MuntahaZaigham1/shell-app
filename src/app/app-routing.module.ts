import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingGuard } from './core/guards/landing.guard';
import { AuthGuard } from './core/guards/auth.guard';
import { TestComponent } from './test/test.component';
import { loadRemoteModule } from '@angular-architects/module-federation';
import { MainLayoutComponent } from './main-layout/main-layout.component';


const routes: Routes = [
  {
    path: "",
    loadChildren: () => import("./landing/landing.module").then((m) => m.LandingModule),
    data: {
      from: "beforeLogin"
    },
    canActivate: [LandingGuard]
  },
  {
    path: "",
    component: MainLayoutComponent,
    children: [
      { path: "", redirectTo: "home", pathMatch: "full" },
      {
        path: "home", component: TestComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "health", component: TestComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'studio',
        loadChildren: () =>
          loadRemoteModule({
            type: 'manifest',
            remoteName: 'studio',
            exposedModule: './StudioModule',
          }).then((m) => m.StudioModule),
      },
      {
        path: 'tool1',
        loadChildren: () =>
          loadRemoteModule({
            type: 'manifest',
            remoteName: 'tool1',
            exposedModule: './Module',
          }).then((m) => m.Tool1Module)
      },
      {
        path: 'codegen',
        loadChildren: () =>
          loadRemoteModule({
            type: 'manifest',
            remoteName: 'fast-code',
            exposedModule: './Module',
          }).then((m) => m.FastcodeModule),
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
