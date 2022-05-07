import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Complaint} from "../entity/Event/Complaint";
import {Observable} from "rxjs";
import {BACKEND_URL} from "../app.module";

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {

  constructor(private httpService: HttpClient) {
  }

  public send(complaint: Complaint): Observable<any> {
    return this.httpService.post(BACKEND_URL + "/api/complaint/create", complaint);
  }

  public findComplaintsAssignedToMeToResolve(): Observable<Complaint[]> {
    return this.httpService.get<Complaint[]>(BACKEND_URL + "/api/complaint/getAssignedComplaints");
  }

  public banEventOwner(eventId: number, author: string) {
    return this.httpService.post(BACKEND_URL + "/api/complaint/banEventOwner", {}, {
      params: {
        eventId: eventId,
        complaintAuthor: author
      }
    });
  }

  public banComplaintAuthor(userId: string, eventId: number) {
    return this.httpService.post(BACKEND_URL + "/api/complaint/banComplaintAuthor", {}, {
      params: {
        eventId: eventId,
        complaintAuthor: userId
      }
    });
  }

  public rejectComplaint(userId: string, eventId: number) {
    return this.httpService.post(BACKEND_URL + "/api/complaint/rejectComplaint", {}, {
      params: {
        eventId: eventId,
        complaintAuthor: userId
      }
    });
  }

  public banEvent(eventId: number, userId: string) {
    return this.httpService.post(BACKEND_URL + "/api/complaint/banEvent", {}, {
      params: {
        eventId: eventId,
        complaintAuthor: userId
      }
    });
  }

  public sendWarningToEventOwner(eventId: number, text: string, userId: string) {
    return this.httpService.post(BACKEND_URL + "/api/complaint/sendWarningToEventOwner", {text: text}, {
      params: {
        eventId: eventId,
        complaintAuthor: userId
      }
    });
  }
}
