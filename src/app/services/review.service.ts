import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Review} from "../entity/Event/Review";
import {BACKEND_URL} from "../app.module";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(private httpClient: HttpClient) {
  }

  public add(review: Review): Observable<any> {
    return this.httpClient.post(BACKEND_URL + "/api/reviews", review);
  }

  public getReviewsForUserEvents(login:string):Observable<Review[]>{
    return this.httpClient.get<Array<Review>>(BACKEND_URL+"/api/reviews/getReviewsForUserEvents",{params:{login:login}});
  }
}
