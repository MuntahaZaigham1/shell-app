import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingGuard } from './core/guards/landing.guard';
import { AuthGuard } from './core/guards/auth.guard';
import { TestComponent } from './test/test.component';
import { loadRemoteModule } from '@angular-architects/module-federation';

const routes: Routes = [
  // {
  //   path: 'studio',
  //   loadChildren: () =>
  //       loadRemoteModule({
  //           type: 'module',
  //           exposedModule: './StudioModule',
  //           remoteEntry: 'http://localhost:4202/remoteEntry.js',
  //       })
  //       .then((m) => m.StudioModule),
  // },

  // {
  //   path: 'studio',
  //   loadChildren: () =>
  //     loadRemoteModule({
  //       type: 'manifest',
  //       remoteName: 'studio',
  //       exposedModule: './StudioModule',
  //     }).then((m) => m.StudioModule),
  // },
  {
    path: 'tool1',
    loadChildren: () =>
      loadRemoteModule({
        type: 'manifest',
        remoteName: 'tool1',
        exposedModule: './Module',
      }).then((m) => m.Tool1Module),
  },

  // {
  //   path:'products', 
  //   loadChildren:() => 
  //       loadRemoteModule({
  //         type: 'module',
  //         remoteEntry: 'http://localhost:4201/remoteEntry.js',
  //         exposedModule: './ProductsModule'
  //       })
  //       .then((m) => m.ProductsModule)
  // },
  // {
  //   path: 'studio',
  //   loadChildren: () => import('studio/Module').then((m) => m.FlightsModule)
  // },
  // {
  //   path: "",
  //   loadChildren: () =>
  //     import("./landing/landing.module").then((m) => m.LandingModule),
  //   data: { from: "beforeLogin" },
  //   canActivate: [LandingGuard],
  // },
  {
    path: "core",
    loadChildren: () => import("./core/core.module").then((m) => m.CoreModule),
  },
  {
    path: "home", component: TestComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "health", component: TestComponent,
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
