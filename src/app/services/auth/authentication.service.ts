import {Injectable} from '@angular/core';
import {HttpClient, HttpHandler, HttpRequest} from "@angular/common/http";
import {Jwt} from "../../entity/Jwt";
import {AppModule, BACKEND_URL} from "../../app.module";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private httpClient: HttpClient) {
  }

  public refreshToken(req: HttpRequest<any>, handle: HttpHandler): void {
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
        this.httpClient.post<Jwt>(BACKEND_URL + "/refreshToken", jwt).subscribe(e => {
          localStorage.setItem("refreshToken", e.refreshToken);
          localStorage.setItem("token", e.id.jwt);
          AppModule.HAS_AUTH = true;
          console.log("SEND NEW REQUEST!")
          handle.handle(req);
        }, error => {
          alert("произошлаа ошибка при обновлении вашего авторизационного токена, заново войдите используя свой логин и пароль")
        });
      }
    }

  }
}
