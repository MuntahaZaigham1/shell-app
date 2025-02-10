// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { LogLevel, OpenIdConfiguration } from 'angular-auth-oidc-client';

export const environment = {
  production: true,
  apiUrl: 'https://127.0.0.1:8181'
};

export const authConfig: OpenIdConfiguration = {
  authority: 'https://login.microsoftonline.com/ed68e3c1-aef4-48be-9306-a94b9c1d4e0e/v2.0',
  redirectUrl: window.location.origin + '/callback',
  clientId: '21b1da23-7877-43c3-9dbd-48b88d996484',
  responseType: 'code',
  scope: 'openid profile email offline_access', // Define the required scopes here
  startCheckSession: false,  // Optional: Enable session management
  silentRenew: true,      // Enable silent refresh for token renewal
  silentRenewUrl: window.location.origin + '/assets/silent-refresh.html',
  postLogoutRedirectUri: window.location.origin,
  // postLoginRoute: '/home',
  forbiddenRoute: '/',
  unauthorizedRoute: '/',
  // logConsoleWarningActive: true,
  logLevel: LogLevel.Debug,
  silentRenewTimeoutInSeconds: 300,
  disableIatOffsetValidation: true,
  autoUserInfo: false,
  useRefreshToken: true
};


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
