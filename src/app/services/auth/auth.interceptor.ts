import {Injectable} from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import {catchError, Observable, switchMap, take, tap, throwError} from 'rxjs';
import {AuthenticationService} from './authentication.service';
import {Jwt} from "../../entity/Jwt";


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
        if (error instanceof HttpErrorResponse && error.status == 403) {
          return this.authService.setAuth(error).pipe(
            take(1),
            switchMap(jwt => {
                var body: Jwt = jwt as unknown as Jwt;
                if (body !== null) {
                  localStorage.setItem("token", body.id.jwt);
                  localStorage.setItem("refreshToken", body.refreshToken);
                  var authorization = request.headers.set("Authorization", body.id.jwt);
                  request = request.clone({headers: authorization})
                  this.authService.setAuth(jwt);
                }
                return next.handle(request);
              }
            ))
        } else
          return throwError(error)
      })
    );

  }
}
