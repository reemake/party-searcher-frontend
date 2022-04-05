import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TypeComponent } from './type/type.component';
import { BACKEND_URL } from '../app.module';

@Injectable({
  providedIn: 'root'
})
export class TypesService {

  constructor(private http: HttpClient) { }
  getTypes(): Observable<TypeComponent[]>{
    return this.http.get<TypeComponent[]>(BACKEND_URL + "/api/eventTypes");
  }
}
