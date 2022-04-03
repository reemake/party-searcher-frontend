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

  getUsers(login: string): Observable<User[]> {
    const headers = { 'login': login }
    return this.http.get<User[]>(BACKEND_URL + "/api/usersList", {headers});
  }

  getRequests(): Observable<Relationship[]> {
    return this.http.get<Relationship[]>(BACKEND_URL + "/api/getRequests");
  }

  getFriends(): Observable<Relationship[]> {
    return this.http.get<Relationship[]>(BACKEND_URL + "/api/getFriends");
  }
}
