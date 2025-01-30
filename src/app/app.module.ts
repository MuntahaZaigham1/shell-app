import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AuthModule, ConfigurationService, OidcSecurityService } from 'angular-auth-oidc-client';
import { authConfig } from 'src/environments/environment';
import { JwtInterceptor } from './core/jwt-interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { TestComponent } from './test/test.component';
import { AuthenticationService } from './core/services/authentication.service';
import { AuthGuard } from './core/guards/auth.guard';
import { LandingGuard } from './core/guards/landing.guard';

@NgModule({
  declarations: [
    AppComponent,
    TestComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    AuthModule.forRoot({
      config: authConfig
    })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    AuthGuard,
    LandingGuard,
    OidcSecurityService,
    ConfigurationService,

  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private authenticationService: AuthenticationService) {
    this.authenticationService.configure();
  }

}
