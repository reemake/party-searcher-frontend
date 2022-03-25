import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {catchError, Observable, tap, throwError} from 'rxjs';
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
      this.authService.setAuth(error).subscribe(val => {
        console.log("I REFRESH");
        console.log("NEW VAL" + JSON.stringify(val.body));
        var body: Jwt = val as unknown as Jwt;
        if (body !== null) {

          localStorage.setItem("token", body.id.jwt);
          localStorage.setItem("refreshToken", body.refreshToken);
          console.log("I REFRESHed");
          var authorization = request.headers.set("Authorization", body.id.jwt);
          request = request.clone({headers: authorization})
          this.authService.setAuth(val);
        }
        console.log("I am going to repeat")
        return next.handle(request);
      })
        return throwError(request)
      })
    );

  }
}
