import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {BACKEND_URL} from "../app.module";
import {Coordinate} from "ol/coordinate";

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor(private httpClient: HttpClient) {
  }

  public getLocations(): Observable<Array<Location>> {
    return this.httpClient.post<Array<Location>>(BACKEND_URL + "/locations", {})
  }

  public getLocationsByRadius(location: Coordinate, radius: number): Observable<Array<Location>> {
    return this.httpClient.post<Array<Location>>(BACKEND_URL + "/locations", {
      location: location,
      radius: radius
    });
  }
}
