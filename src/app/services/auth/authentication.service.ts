import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Jwt} from "../../entity/Jwt";
import {AppModule, BACKEND_URL} from "../../app.module";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private httpClient: HttpClient) {
  }

  public refreshToken(): Observable<Jwt> {
    if (!AppModule.HAS_AUTH) {
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
        return this.httpClient.post<Jwt>(BACKEND_URL + "/refreshToken", jwt);
      }
    }
    return new Observable<Jwt>();

  }
}
