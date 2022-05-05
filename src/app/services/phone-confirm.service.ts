import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {BACKEND_URL} from "../app.module";

@Injectable({
  providedIn: 'root'
})
export class PhoneConfirmService {

  constructor(private httpClient: HttpClient) {
  }

  public sendCode(phone: string): Observable<any> {
    return this.httpClient.post(BACKEND_URL + "/api/phoneToken/sendToken", {}, {params: {phone: phone}});
  }

  public checkCode(phone: string, code: string): Observable<boolean> {
    return this.httpClient.get<boolean>(BACKEND_URL + "/api/phoneToken/sendToken", {
      params: {
        phone: phone,
        code: code
      }
    });
  }
}
