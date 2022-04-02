import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {catchError, Observable, switchMap, tap, throwError} from 'rxjs';
import {AuthenticationService} from './authentication.service';


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
    return next.handle(request).pipe(tap((val) => {
      if (val instanceof HttpResponse) {
        this.authService.setAuth(val);
      }
    }), catchError(error => {
      this.authService.setAuth(error).pipe(
        switchMap((val, index) => {
          console.log("I REFRESHED");
          localStorage.setItem("token", val.id.jwt);
          localStorage.setItem("refreshToken", val.refreshToken);
          var authorization = request.headers.set("Authorization", val.id.jwt);
          request = request.clone({headers: authorization})
          return next.handle(request)
        })
      );
      return throwError(error);
    }));

  }
}
