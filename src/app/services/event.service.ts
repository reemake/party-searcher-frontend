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

  public setAddressByLonLat(event: Event, func: Function): void {
    console.log("open xml")
    var lon = event.location?.location.coordinates[0];
    var lat = event.location?.location.coordinates[1];
    var xhr = new XMLHttpRequest();

    xhr.setRequestHeader("lon", String(lon));
    xhr.setRequestHeader("lat", String(lat));

    xhr.onload = () => {
      console.log("secomd \n" + event);
      var document = xhr.responseXML;

      var fullAddress = [];
      if (event.location !== undefined) {
        if (document != null) {
          var city = document.getElementsByName("city");
          var road = document.getElementsByName("road");
          var house = document.getElementsByName("house_number");
          if (city.length != 0) {
            fullAddress.push(city[0]);
          }
          if (road.length != 0) {
            fullAddress.push(road[0]);
          }
          if (house.length != 0) {
            fullAddress.push(house[0]);
          }

          event.location.name = fullAddress.join(",");
        } else {
          event.location.name = "";
        }
      }

      func();
    }
    xhr.open('GET', "https://nominatim.openstreetmap.org/reverse", true);
    xhr.send();


  }

}
