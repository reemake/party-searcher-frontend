import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {BACKEND_URL} from "../app.module";
import {Coordinate} from "ol/coordinate";
import {Event} from "../entity/Event/Event";


@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private httpClient: HttpClient) {
  }


  public getEventsWithinRadius(location: Coordinate, radius: number): Observable<Array<Event>> {
    return this.httpClient.post<Array<Event>>(BACKEND_URL + "/events", {
      location: location,
      radius: radius
    });
  }

  public getEventsAtUserMap(userMapBoundingBox: Coordinate[]): Observable<Array<Event>> {
    return this.httpClient.post<Array<Event>>(BACKEND_URL + "/events", {
      'userMapBoundingBox': userMapBoundingBox
    });
  }

}
