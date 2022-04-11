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
          var username = val.headers.get("username");
          if (localStorage.getItem('username') !== username && username)
            localStorage.setItem("username", username);
          this.authService.setAuth(val);
        }
      }), catchError(error => {
      console.log("auth error")
      if (error instanceof HttpErrorResponse && (error.status == 403 || error.status == 401)) {
        return this.authService.setAuth(error).pipe(
          take(1),
          switchMap(jwt => {
              var body: Jwt = jwt as unknown as Jwt;
              if (body !== null) {
                console.log("UPDATE JWT")
                console.log(body);
                localStorage.setItem("token", body.id.jwt);
                localStorage.setItem("refreshToken", body.refreshToken);
                var authorization = request.headers.set("Authorization", body.id.jwt);
                this.authService.updateJWT.next(body.id.jwt);
                request = request.clone({headers: authorization})
                //  this.authService.setAuth(jwt);
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
