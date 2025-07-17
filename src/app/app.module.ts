import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AuthModule, ConfigurationService, OidcSecurityService } from 'angular-auth-oidc-client';
import { authConfig } from 'src/environments/environment';
import { JwtInterceptor } from './core/jwt-interceptor';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { AuthenticationService } from './core/services/authentication.service';
import { AuthGuard } from './core/guards/auth.guard';
import { LandingGuard } from './core/guards/landing.guard';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router, RouteReuseStrategy } from '@angular/router';
import { CustomRouteReuseStrategy } from './custom-reuse-strategy';
import { MaterialModule } from './landing/material.module';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { SharedAuthenticationService, SharedService } from 'fastcode-shared-service';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { ScriptLoadingService } from './services/script-loading.service';
import { StylesLoadingService } from './services/styles-loading.service';
import { RedirectAfterLoginComponent } from './redirect-after-login.component';
import { VsCodeExtCommunicationService } from './services/vs-code-ext-communication.service';
import { HomeComponent } from './home/home.component';
import { ApplicationService } from './applications/application.service';
import { ShellExportBridgeService } from './services/shell-export-bridge.service';


// Dynamic translation loader
export function RemoteTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MainLayoutComponent,
    RedirectAfterLoginComponent 
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
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    ScriptLoadingService,
    StylesLoadingService,
    SharedService,
    ApplicationService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private authenticationService: AuthenticationService,
    private router: Router,
  ) {
    // this.authenticationService.configure();
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

    // this.sharedAuthenticationService.sendAuthToken(this.authenticationService.idToken);

    this.authenticationService.initializeTokenListener();
  }
}