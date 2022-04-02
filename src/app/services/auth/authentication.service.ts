import {HttpClient, HttpErrorResponse, HttpResponse, HttpResponseBase} from '@angular/common/http';
import {Injectable} from '@angular/core';
import { Router } from '@angular/router';
import {catchError, Observable, of, tap} from 'rxjs';
import {BACKEND_URL} from 'src/app/app.module';
import {Jwt} from 'src/app/entity/Jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private hasAuth: boolean = false;

  constructor(private httpClient: HttpClient, private router: Router) {
    console.log("AUTH SERVICE CREATED")
  }

  public refreshToken(): Observable<Jwt> {
    if (!this.hasAuth) {
      var refresh = localStorage.getItem("refreshToken");
      var token = localStorage.getItem("token");
      if (refresh !== null && token !== null) {
        console.log("I am going to refresh")
        var jwt: Jwt = {
          refreshToken: refresh,
          id: {
            jwt: token
          }
        }
        return this.httpClient.post<Jwt>(BACKEND_URL + "/refreshToken", jwt).pipe(tap(resp => {
          this.hasAuth = true;
        }), catchError((err) => {
          this.hasAuth = false;
          return of(err);
        }));
      }
    }
    return new Observable<Jwt>();

  }

  public setAuth(httpEvent: HttpResponseBase): Observable<Jwt> {
    if (httpEvent instanceof HttpErrorResponse) {
      if (httpEvent.status == 403) {
        console.log("SET BAD")
        this.hasAuth = false;
        return this.refreshToken();
      }
    } else if (httpEvent instanceof HttpResponse) {
      if (httpEvent.status == 403) {
        this.hasAuth = false;
        return this.refreshToken();
      } else this.hasAuth = true;
    }
    return new Observable<Jwt>();
  }

  public isAuth(): boolean {
    return this.hasAuth;
  }

  logOut() {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    this.hasAuth = false;
    this.router.navigate(['/login']);
}

}
