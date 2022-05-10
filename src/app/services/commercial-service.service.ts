import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {CommercialAccountConnectionTicket} from "../entity/CommercialAccountConnectionTicket";
import {BACKEND_URL} from "../app.module";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CommercialServiceService {

  constructor(private httpClient: HttpClient) {
  }


  public getInfoAboutCommercialUser(): Observable<CommercialAccountConnectionTicket> {
    return this.httpClient.get<CommercialAccountConnectionTicket>(BACKEND_URL + "/api/users/getExistingCommercialRegistration");
  }

  public getUrlForPaying(): Observable<any> {
    return this.httpClient.get(BACKEND_URL + "/api/paid/getPayingUrl");
  }

  public getNewUrlForPaying(): Observable<any> {
    return this.httpClient.get(BACKEND_URL + "/api/paid/getNewUrl");
  }

}
