import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from './entity/User';
import {BACKEND_URL} from "./app.module";

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  constructor(private httpClient: HttpClient) { }

  public loginUserFromRemote(user: User):Observable<any> {
    return this.httpClient.post(BACKEND_URL + "/profile/login", user);
  }
}
