import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BACKEND_URL } from '../app.module';
import { User } from '../entity/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

  public getUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(BACKEND_URL + "/api/users/getUsers");
  }

  public getUser(userLogin: string): Observable<User> {
    return this.httpClient.get<User>(BACKEND_URL + "/api/users/getUserByLogin", {params: {userLogin: userLogin}});
  }

  public updateUser(user: User): Observable<any> {
    return this.httpClient.patch<any>(BACKEND_URL + "/api/users/updateUser", user);
  }

  public approvePassword(login: string, password: string): Observable<any> {
    return this.httpClient.get<any>(BACKEND_URL + "/api/users/approvePassword", {params: {login, password}});
  }

}
