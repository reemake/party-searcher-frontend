import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Notification} from "../entity/Notification";
import {BACKEND_URL} from "../app.module";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private httpService: HttpClient) {
  }

  public load(): Observable<Notification[]> {
    return this.httpService.get<Notification[]>(BACKEND_URL + "/api/notification/getAll");
  }

  public hasNew(): Observable<boolean> {
    return this.httpService.get<boolean>(BACKEND_URL + "/api/notification/hasNew");
  }

  public setAsShown(notifications: Notification[]) {
    return this.httpService.post(BACKEND_URL + "/api/notification/setAsShown", notifications);
  }
}
