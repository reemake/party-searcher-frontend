import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from '../../entity/User';
import {BACKEND_URL} from "../../app.module";

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  constructor(private httpClient: HttpClient) {
  }

  public loginUserFromRemote(user: User): Observable<any> {
    var headers = new HttpHeaders();
    headers = headers.set("username", user.login);
    headers = headers.set("password", user.password);
    localStorage.setItem("username", user.login);
    return this.httpClient.post<any>(BACKEND_URL + "/login", {}, {observe: 'response', headers: headers});
  }

  public registerUserFromRemote(user: User):Observable<any> {
    return this.httpClient.post<any>(BACKEND_URL + "/register", user);
    }
}
