import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable, Subject, tap} from "rxjs";
import {BACKEND_URL} from "../app.module";
import {Event} from "../entity/Event/Event";
import {EventType} from "../entity/Event/EventType";
import {FilterData} from "../entity/filterData";
import {EventPage} from "../entity/Event/EventPage";


@Injectable({
  providedIn: 'root'
})
export class EventService {
  private endedEvents: Array<Event> | undefined = undefined;


  constructor(private httpClient: HttpClient) {
  }


  public getEvents(): Observable<Array<Event>> {
    return this.httpClient.get<Array<Event>>(BACKEND_URL + "/api/events/getEvents");
  }

  public getUsersCreatedEventsByLogin(userLogin: string): Observable<Event[]> {
    return this.httpClient.get<Event[]>(BACKEND_URL + "/api/events/getUsersCreatedEventsByLogin", {params: {userLogin}});
  }

  public getUsersAttendedEventsByLogin(userLogin: string): Observable<Event[]> {
    return this.httpClient.get<Event[]>(BACKEND_URL + "/api/events/getUsersAttendedEventsByLogin", {params: {userLogin}});
  }

  public getEventsWithinRadius(point: number[], radius: number): Observable<Array<Event>> {
    var params: HttpParams = new HttpParams();
    params = params.set("lon", point[0]).set("lat", point[1]).set("radius", radius);
    return this.httpClient.get<Array<Event>>(BACKEND_URL + "/api/events/getEventsWithinRadius", {params: params});
  }

  /*  public getEventsAtUserMap(userMapBoundingBox: Coordinate[]): Observable<Array<Event>> {
      return this.httpClient.get<Array<Event>>(BACKEND_URL + "/events", {
        'userMapBoundingBox': userMapBoundingBox
      });
    }*/

  public add(event: Event): Observable<any> {

    return this.httpClient.post(BACKEND_URL + "/api/events", event);
  }

  public removeCurrentUserFromEvent(id: number): Observable<any> {
    return this.httpClient.delete(BACKEND_URL + "/api/events/deleteCurrentUserFromEvent", {params: {eventId: id}});
  }

  public getWords(wordPart: string): Observable<string[]> {
    return this.httpClient.get<Array<string>>(BACKEND_URL + "/api/events/getWords", {params: {word: wordPart}});
  }

  public getTypes(): Observable<EventType[]> {
    return this.httpClient.get<Array<EventType>>(BACKEND_URL + "/api/eventTypes");
  }

  public filter(filter: FilterData): Observable<Event[]> {
    return this.httpClient.post<Array<Event>>(BACKEND_URL + "/api/events/filter", filter);
  }

  public filterWithPaging(filter: FilterData, page: number, size: number): Observable<EventPage> {
    var params: HttpParams = new HttpParams();
    params = params.set("pageNum", page).set("size", size);
    return this.httpClient.post<EventPage>(BACKEND_URL + "/api/events/filterWithPaging", filter, {params: params});
  }

  public assignOnEvent(id: number): Observable<any> {
    var param: HttpParams = new HttpParams();
    param = param.set("eventId", id);
    return this.httpClient.post(BACKEND_URL + "/api/events/assignOnEvent", null, {params: param});
  }

  public removeEvent(id: number): Observable<any> {
    return this.httpClient.delete(BACKEND_URL + "/api/events", {params: {eventId: id}});
  }

  public editEvent(event: Event): Observable<any> {
    return this.httpClient.patch(BACKEND_URL + "/api/events", event);
  }

  public get(id: number): Observable<Event> {
    return this.httpClient.get<Event>(BACKEND_URL + "/api/events/getEvent", {params: {eventId: id}});
  }

  public getEndedEvents(): Observable<Array<Event>> {
    if (this.endedEvents === undefined) {
      console.log("REQUEST FOR ENDED EVENTS")
      return this.httpClient.get<Array<Event>>(BACKEND_URL + "/api/events/getEndedEvents").pipe(tap((events) => {
        this.endedEvents = events;
      }));
    } else {
      console.log("NO REQUEST")
      var subject = new Subject();
      subject.next(this.endedEvents);
      return subject as Observable<Array<Event>>;
    }
  }

  public setAddressByLonLat(event: any, func: Function): void {

    var lon = event.location?.location.coordinates[0];
    var lat = event.location?.location.coordinates[1];
    var url = `https://nominatim.openstreetmap.org/reverse?lon=${lon}&lat=${lat}`;
    var response = fetch(url);
    response.then((value) => {
      value.text().then((val) => {
        var parser = new DOMParser();
        var fullAddress = [];
        var document = parser.parseFromString(val, "application/xml");
        if (event.location !== undefined && document !== undefined) {
          var city = document.evaluate("reversegeocode/addressparts/city", document, null, XPathResult.STRING_TYPE).stringValue;
          var road = document.evaluate("reversegeocode/addressparts/road", document, null, XPathResult.STRING_TYPE).stringValue;
          var house = document.evaluate("reversegeocode/addressparts/house_number", document, null, XPathResult.STRING_TYPE).stringValue;
          var state = document.evaluate("reversegeocode/addressparts/state", document, null, XPathResult.STRING_TYPE).stringValue;
          var neigbourhood = document.evaluate("reversegeocode/addressparts/neighbourhood", document, null, XPathResult.STRING_TYPE).stringValue;
          if (city !== "") {
            fullAddress.push(city);
          } else {
            if (state !== "")
              fullAddress.push(state);
          }

          if (road != "") {
            fullAddress.push(road);
          } else {
            if (neigbourhood != "") {
              fullAddress.push(neigbourhood);
            }
          }
          if (house != "") {
            fullAddress.push(house);
          }
          if (fullAddress.length <= 1) {
            var district = document.evaluate("reversegeocode/addressparts/city_district", document, null, XPathResult.STRING_TYPE).stringValue;
            var county = document.evaluate("reversegeocode/addressparts/county", document, null, XPathResult.STRING_TYPE).stringValue;
            if (county != "")
              fullAddress.push(county);
            if (district != "")
              fullAddress.push(district);
          }

          event.location.name = fullAddress.join(",");
        }
        func();
      })
    });


  }

}
