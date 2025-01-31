import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from './authentication.service';
import { CookieService } from './cookie.service';
@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authService: AuthenticationService, private cookieService: CookieService) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available


        request = request.clone({ headers: request.headers.set('Accept', 'application/json') });
        if (request.url.search('https://login.microsoftonline.com') == -1) {
            let headers: any = {
                "X-XSRF-TOKEN": this.cookieService.get("XSRF-TOKEN"),
                Accept: 'application/json'
            }
            const idToken = this.authService.idToken;
            if (idToken) {
                this.cookieService.set('Authentication', idToken ? ("Bearer_" + idToken) : idToken);
            }
            if (this.authService.authorizationToken) {
                headers["Authorization"] = this.authService.authorizationToken;
            }


            request = request.clone({
                withCredentials: true,
                setHeaders: headers
            });
        }
        return next.handle(request);
    }
}
