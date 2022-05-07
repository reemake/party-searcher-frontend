import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {User} from 'src/app/entity/User';
import { BACKEND_URL } from 'src/app/app.module';
import { Relationship } from './Relationship';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUsersByLogin(login: string): Observable<User[]> {
    const params = { 'login': login }
    console.log("waiting data");
    return this.http.get<User[]>(BACKEND_URL + "/api/users/usersListByLogin", {params: params});
  }

  getUsersByFirstLastName(name: string): Observable<User[]> {
    const headers = { 
      "name": name
     };
     console.log("waiting data");
     return this.http.get<User[]>(BACKEND_URL + "/api/users/usersListByName", {params: headers});
  }

  getRequests(): Observable<Relationship[]> {
    console.log("waiting data");
    return this.http.get<Relationship[]>(BACKEND_URL + "/api/friends/getRequests");
  }

  getFriends(): Observable<Relationship[]> {
    console.log("waiting data");
    return this.http.get<Relationship[]>(BACKEND_URL + "/api/friends/getFriends");
  }

  getSendedRequests(): Observable<Relationship[]> {
    console.log("waiting data");
    return this.http.get<Relationship[]>(BACKEND_URL + "/api/friends/getSendedRequests");
  }

  getUsersByEmail(mail: string): Observable<User[]> {
    const headers = { 
      "mail": mail
     };
     console.log("waiting data");
     return this.http.get<User[]>(BACKEND_URL + "/api/users/usersListByEmail", {params: headers});
  }
}
