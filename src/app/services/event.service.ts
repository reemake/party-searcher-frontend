import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {BACKEND_URL} from "../app.module";
import {Coordinate} from "ol/coordinate";
import {Event} from "../entity/Event/Event";
import {EventType} from "../entity/Event/EventType";


@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private httpClient: HttpClient) {
  }


  public getEventsWithinRadius(location: Coordinate, radius: number): Observable<Array<Event>> {
    return this.httpClient.get<Array<Event>>(BACKEND_URL + "/events/getEventsWithinRadius", {
      params: {
        location: location,
        radius: radius
      }
    });
  }

  public getEvents(): Observable<Array<Event>> {
    return this.httpClient.get<Array<Event>>(BACKEND_URL + "/events/getEvents");
  }

  /*  public getEventsAtUserMap(userMapBoundingBox: Coordinate[]): Observable<Array<Event>> {
      return this.httpClient.get<Array<Event>>(BACKEND_URL + "/events", {
        'userMapBoundingBox': userMapBoundingBox
      });
    }*/

  public add(event: Event): Observable<any> {
    return this.httpClient.post(BACKEND_URL + "/events", event);
  }

  public getWords(wordPart: string): Observable<string[]> {
    return this.httpClient.get<Array<string>>(BACKEND_URL + "/events/getKeyWords", {params: {wordPart: wordPart}});
  }

  public getTypes(): Observable<EventType[]> {
    return this.httpClient.get<Array<EventType>>(BACKEND_URL + "/eventTypes");
  }

  public getAddressByLonLat(lon: number, lat: number): Observable<any> {
    return this.httpClient.get<any>("https://nominatim.openstreetmap.org/reverse", {
      params: {
        lon: lon,
        lat: lat
      }
    });
  }

}
