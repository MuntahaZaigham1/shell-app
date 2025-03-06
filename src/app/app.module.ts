import { Injectable, Injector, NgModule, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AuthModule, ConfigurationService, OidcSecurityService } from 'angular-auth-oidc-client';
import { authConfig } from 'src/environments/environment';
import { JwtInterceptor } from './core/jwt-interceptor';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { TestComponent } from './test/test.component';
import { AuthenticationService } from './core/services/authentication.service';
import { AuthGuard } from './core/guards/auth.guard';
import { LandingGuard } from './core/guards/landing.guard';
import { Observable } from 'rxjs';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router, RouteReuseStrategy } from '@angular/router';
import { CustomRouteReuseStrategy } from './custom-reuse-strategy';
import { MaterialModule } from './landing/material.module';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { SharedNavigationService } from 'fastcode-shared-service';


// Dynamic translation loader
export function RemoteTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}



@NgModule({
  declarations: [
    AppComponent,
    TestComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CoreModule,
    AuthModule.forRoot({
      config: authConfig
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: RemoteTranslateLoader,
        deps: [HttpClient]
      }
    }),
    MaterialModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy },
    AuthGuard,
    LandingGuard,
    OidcSecurityService,
    ConfigurationService,
    TranslateService,
    { provide: LocationStrategy, useClass: PathLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private authenticationService: AuthenticationService,
    private injector: Injector,
    private router: Router
  ) {
    // this.authenticationService.configure();
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }
}