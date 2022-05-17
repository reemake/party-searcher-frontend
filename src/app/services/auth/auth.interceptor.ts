import {Injectable} from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import {catchError, Observable, switchMap, tap, throwError} from 'rxjs';
import {AuthenticationService} from './authentication.service';
import {Jwt} from "../../entity/Jwt";
import {CookieService} from "ngx-cookie-service";


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthenticationService,private cookie:CookieService) {
  }
  public refreshFailed=false;

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log(request.url.indexOf("/refreshToken"))
    if (request.url.indexOf("/refreshToken")==-1) {
      var token = localStorage.getItem("token");
      if (token !== null && !this.cookie.check("refreshError")) {
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
          console.log(error);
          if (error instanceof HttpErrorResponse && (error.status == 403 || error.status == 401) && !this.refreshFailed) {
            return this.authService.setAuth(error).pipe(
              tap((val) => {

              }, error1 => {
                this.refreshFailed = true;
              }),
              switchMap(jwt => {
                  var body: Jwt = jwt as unknown as Jwt;
                  if (body !== null) {
                    localStorage.setItem("token", body.id.jwt);
                    localStorage.setItem("refreshToken", body.refreshToken);
                    var authorization = request.headers.set("Authorization", body.id.jwt);
                    this.authService.updateJWT.next(body.id.jwt);
                    request = request.clone({headers: authorization})
                    this.cookie.delete("refreshError");
                    //  this.authService.setAuth(jwt);
                  }
                  return next.handle(request);
                }
              ), catchError((error) => {
                this.refreshFailed = true;
                return throwError(error)
              }),
            )
          } else {
            return next.handle(request).pipe(tap((val) => {

            }, error1 => {
              this.refreshFailed = true;
            }));
          }
        })
      );
    }
    else {

      return next.handle(request).pipe(tap(val=>{

      },error => {
        if (!this.cookie.get("refreshError")) {
          this.cookie.set("refreshError", "true",300000);
          alert("При обновлении токена произошла ошибка, попробуйте заново авторизоваться");
        }
      }));
    }
  }
}
