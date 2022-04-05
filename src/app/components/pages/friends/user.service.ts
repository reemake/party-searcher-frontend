import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './user';
import { BACKEND_URL } from 'src/app/app.module';
import { Relationship } from './Relationship';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUsersByLogin(login: string): Observable<User[]> {
    const headers = { 'login': login }
    return this.http.get<User[]>(BACKEND_URL + "/api/usersListByLogin", {headers});
  }

  getUsersByFirstLastName(name: string): Observable<User[]> {
    var userData: string[] = name.split(" ");
    console.log(userData);
    const headers = { 
      "firstName": userData[0],
      "lastName": userData[1]
     };
    return this.http.get<User[]>(BACKEND_URL + "/api/usersListByName", {headers});
  }

  getRequests(): Observable<Relationship[]> {
    return this.http.get<Relationship[]>(BACKEND_URL + "/api/getRequests");
  }

  getFriends(): Observable<Relationship[]> {
    return this.http.get<Relationship[]>(BACKEND_URL + "/api/getFriends");
  }

  getSendedRequests(): Observable<Relationship[]> {
    return this.http.get<Relationship[]>(BACKEND_URL + "/api/getSendedRequests");
  }
}
