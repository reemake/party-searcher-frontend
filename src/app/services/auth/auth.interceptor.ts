import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {catchError, Observable, switchMap, throwError} from 'rxjs';
import {AuthenticationService} from "./authentication.service";


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthenticationService) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    var token = localStorage.getItem("token");
    if (token !== null) {
      var authorization = request.headers.set("Authorization", token);
      request = request.clone({headers: authorization});
    }
    return next.handle(request).pipe(catchError(error => {
      if (error.status === 403) {
        return this.authService.refreshToken().pipe(
          switchMap((val, index) => {
            console.log("I REFRESHED");
            localStorage.setItem("token", val.id.jwt);
            localStorage.setItem("refreshToken", val.refreshToken);
            var authorization = request.headers.set("Authorization", val.id.jwt);
            request = request.clone({headers: authorization});
            return next.handle(request)
          })
        )
      }
      return throwError(error);
    }));

  }

}
