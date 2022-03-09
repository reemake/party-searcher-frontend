import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TypeComponent } from './type/type.component';

@Injectable({
  providedIn: 'root'
})
export class TypesService {

  private baseUrl = "http://localhost:8080/eventTypes";
  constructor(private http: HttpClient) { }
  getTypes(): Observable<TypeComponent[]>{
    return this.http.get<TypeComponent[]>(`${this.baseUrl}`);
  }
}
