import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Complaint} from "../entity/Event/Complaint";
import {Observable} from "rxjs";
import {BACKEND_URL} from "../app.module";

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {

  constructor(private httpService:HttpClient) { }

  public send(complaint:Complaint):Observable<any>{
    return this.httpService.post(BACKEND_URL+"/api/complaint/create",complaint);
  }
}
