import {HttpClient, HttpErrorResponse, HttpResponse, HttpResponseBase} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {BACKEND_URL} from 'src/app/app.module';
import {Jwt} from 'src/app/entity/Jwt';
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  public updateJWT: Subject<string> = new Subject<string>();
  private hasAuth: boolean = false;

  constructor(private httpClient: HttpClient, private router: Router) {
    console.log("AUTH SERVICE CREATED")
  }

  public refreshToken(): Observable<HttpResponse<Jwt>> {
    console.log("TRY TO UPDATE")
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


        return this.httpClient.post<HttpResponse<Jwt>>(BACKEND_URL + "/refreshToken", jwt);
      }
    }
    console.log("NOT UPDATE")
    return new Observable<HttpResponse<Jwt>>();

  }

  public getToken(): string {
    return localStorage.getItem("token") || "";
  }


  public setAuth(httpEvent: HttpResponseBase): Observable<HttpResponse<Jwt>> {
    if (httpEvent instanceof HttpErrorResponse) {
      if (httpEvent.status == 403 || httpEvent.status == 401) {
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
    return new Observable<HttpResponse<Jwt>>();
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
