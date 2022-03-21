import {Injectable} from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {AuthenticationService} from "./authentication.service";
import {AppModule} from "../../app.module";


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
    return next.handle(request).pipe(tap((event: HttpEvent<any>) => {
        console.log("INTERCEPT")
        if (event instanceof HttpResponse)
          if (event.status != 403) {
            AppModule.HAS_AUTH = true;
            console.log("ALL FINE")
          }
      }
      , (err) => {

        if (err instanceof HttpErrorResponse) {
          if (err.status == 403) {
            console.log("ALL BAD");
            AppModule.HAS_AUTH = false;
            console.log("try to refresh  token");
            this.authService.refreshToken();
          }
        }
      }));
  }

}
