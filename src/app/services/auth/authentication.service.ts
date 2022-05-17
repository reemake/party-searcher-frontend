import {HttpClient, HttpErrorResponse, HttpResponse, HttpResponseBase} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {map, Observable, Subject} from 'rxjs';
import {BACKEND_URL} from 'src/app/app.module';
import {Jwt} from 'src/app/entity/Jwt';
import {Router} from "@angular/router";
import {User} from "../../entity/User";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  public updateJWT: Subject<string> = new Subject<string>();
  private hasAuth: boolean = false;
public refreshFailed=false;
private updateAuthStatus:Subject<boolean>=new Subject<boolean>();

  constructor(private httpClient: HttpClient, private router: Router) {
    console.log("AUTH SERVICE CREATED")
  }

  public checkAuth(): Observable<boolean> {
    console.log("DO CHECK")
    return this.httpClient.get(BACKEND_URL + "/api/users/checkUser").pipe(map((res: any) => !(res.status === 403 || res.status == 401))).pipe(map((res:boolean)=>{
      console.log(`I CHECK AUTH STATUS ${res}`)
      if(res){
        this.updateAuthStatus.next(true);
      }
      return res;
    }));
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

  public changeAuth():Observable<boolean>{
    return this.updateAuthStatus;
  }

  public getUserData():Observable<User>{
    return this.httpClient.get<User>(BACKEND_URL+"/api/users/getCurrentUser");
  }

  public getToken(): string {
    return localStorage.getItem("token") || "";
  }

  public setAuth(httpEvent: HttpResponseBase): Observable<HttpResponse<Jwt>> {
    var authErrorMarker: Subject<any> = new Subject();
    authErrorMarker.error("false");
    if (httpEvent instanceof HttpErrorResponse) {
      if (httpEvent.status == 403 || httpEvent.status == 401) {
        this.hasAuth = false;
        if (localStorage.getItem("token")) {
          return this.refreshToken();
        } else return authErrorMarker;
      }
    } else if (httpEvent instanceof HttpResponse) {
      if (httpEvent.status == 403) {
        this.hasAuth = false;
        if (localStorage.getItem("token")) {
          return this.refreshToken();
        } else {

          return authErrorMarker;
        }
      } else{
        this.hasAuth = true;
      }
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
