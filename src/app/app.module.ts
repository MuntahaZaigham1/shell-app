import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
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
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router, RouteReuseStrategy } from '@angular/router';
import { CustomRouteReuseStrategy } from './custom-reuse-strategy';
import { MaterialModule } from './landing/material.module';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { SharedAuthenticationService } from 'fastcode-shared-service';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { ScriptLoadingService } from './services/script-loading.service';
import { StylesLoadingService } from './services/styles-loading.service';


// Dynamic translation loader
export function RemoteTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}



@NgModule({
  declarations: [
    AppComponent,
    TestComponent,
    MainLayoutComponent
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
    StylesLoadingService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private authenticationService: AuthenticationService,
    private injector: Injector,
    private router: Router,
    private sharedAuthenticationService: SharedAuthenticationService
  ) {
    // this.authenticationService.configure();
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

    this.sharedAuthenticationService.sendAuthToken(this.authenticationService.idToken);

    window.addEventListener('message', (event) => {
      console.log("Message received in iframe:", event);
      if (event.data.command === 'setToken') {
        // Store the token in your Angular app's auth service
        this.authenticationService.setLoggedInUserPermissions(event.data.token)
        console.log("setTojken", this.authenticationService.idToken);
      }
    });

    setTimeout(() => {
      if (!this.authenticationService.token) {
        window.parent.postMessage({ command: 'requestToken' }, '*');
      }
    }, 2000);
  
    // Request token from parent (VS Code webview)
    window.parent.postMessage({ command: 'getToken' }, '*');
    console.log("hello", this.authenticationService.idToken);
  }
}