import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { filter, Observable, switchMap, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from './services/authentication.service';
import { CookieService } from './services/cookie.service';


@Injectable()
export class JwtInterceptor implements HttpInterceptor {


    constructor(private authService: AuthenticationService, private cookieService: CookieService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        const isAuthorizationTokenRequest = request.url.endsWith('/auth/getAuthorizationToken');
        if (isAuthorizationTokenRequest) {
            let headers: any = {
                "X-XSRF-TOKEN": this.cookieService.get("XSRF-TOKEN"),
                Accept: 'application/json'
            }
            if (this.authService.isVsCodeExtension() && this.authService.idToken) {
                headers["Authentication"] = this.authService.idToken;
            }
            request = request.clone({
                withCredentials: true,
                setHeaders: headers,
                body: request.body
            });
            return next.handle(request);
        }
        // For all other requests, wait for authorization state to be ready
        return this.authService.authorizationState$.pipe(
            filter(isAuthorized => isAuthorized === true),
            take(1),
            switchMap(() => {
                request = request.clone({ headers: request.headers.set('Accept', 'application/json'), body: request.body });
                if (request.url.search('https://login.microsoftonline.com') == -1) {
                    let headers: any = {
                        "X-XSRF-TOKEN": this.cookieService.get("XSRF-TOKEN"),
                        Accept: 'application/json'
                    }
                    if (this.authService.isVsCodeExtension() && this.authService.idToken) {
                        headers["Authentication"] = this.authService.idToken;
                    }
                    if (this.authService.authorizationToken) {
                        headers["Authorization"] = this.authService.authorizationToken;
                    }

                    request = request.clone({
                        withCredentials: true,
                        setHeaders: headers,
                        body: request.body
                    });
                }
                return next.handle(request);
            }))
    }
}
