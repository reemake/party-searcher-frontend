import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BACKEND_URL } from 'src/app/app.module';
import { Invite } from './invite';

@Injectable({
  providedIn: 'root'
})
export class InviteService {

  constructor(private http: HttpClient) {}

  public isInvated(): Observable<boolean> {
    console.log("Waiting invites to event");
    return this.http.get<boolean>(BACKEND_URL + "/api/events/getInvitesEventCheck");
  }

  public getInvites(): Observable<Invite[]> {
    console.log("Waiting invites list");
    return this.http.get<Invite[]>(BACKEND_URL + "/api/events/getInvitesEvent");
  }
}
