import { Component, OnInit } from '@angular/core';
import { TypesService } from '../../../services/types.service';
import { TypeComponent } from '../../type/type.component';
import { FormControl } from '@angular/forms';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import { BACKEND_URL } from 'src/app/app.module';

@Component({
  selector: 'survey.test',
  templateUrl: './survey.test.component.html',
  styleUrls: ['./survey.test.component.css']
})
export class SurveyTest implements OnInit {

  public typeCheck: FormControl = new FormControl( {} );
  types: TypeComponent[] = [];
  private checkType: boolean = false;
  private checkFormat: boolean = false;
  private checkDate: boolean = false;
  private checkTextFields: boolean = true;

  constructor(private typesService: TypesService, private httpClient: HttpClient) {
    
  }

  ngOnInit(): void {
    this.typesService.getTypes().subscribe((data: TypeComponent[]) => {
      this.types = data;
    });
  }

  public click(): void {
    var type = document.getElementsByName("type");
    this.checkType = false;
    for (var i = 0; i < type.length; i++) if ((<HTMLInputElement> (type[i])).checked) this.checkType = true;
    var format = document.getElementsByName("format");
    this.checkFormat = false;
    for (var i = 0; i < format.length; i++) if ((<HTMLInputElement> (format[i])).checked) this.checkFormat = true;
    var date = document.getElementsByClassName("radio-area-time");
    this.checkDate = false;
    if ((<HTMLInputElement> (date[0])).value && (<HTMLInputElement> (date[1])).value) { this.checkDate = true; }
    var textFields = document.getElementsByClassName("surveyTest-textarea");
    this.checkTextFields = true;
    for (var i = 0; i < textFields.length; i++) if ((<HTMLInputElement> (textFields[i])).value === "") this.checkTextFields = false;
    if (this.checkType && this.checkFormat && this.checkDate && this.checkTextFields) {
      this.getResult();
      location.href = "/";
    }
    else alert("Необходимо заполнить все поля")
  }

  private getResult(): void {
    var type = document.getElementsByName("type");
    let typeList: Array<string> = [];
    for (var i = 0; i < type.length; i++) if ((<HTMLInputElement> (type[i])).checked) typeList.push((<HTMLInputElement> type[i]).value);
    var format = document.getElementsByName("format");
    let formatList: Array<string> = [];
    for (var i = 0; i < format.length; i++) if ((<HTMLInputElement> (format[i])).checked) formatList.push((<HTMLInputElement> format[i]).value);
    var timeStart = new Date((<HTMLInputElement> document.getElementById("timeStart")).value);
    var timeEnd = new Date((<HTMLInputElement> document.getElementById("timeEnd")).value);
    var memberStart = parseInt((<HTMLInputElement> document.getElementById("memberStart")).value, 10);
    var memberEnd = parseInt((<HTMLInputElement> document.getElementById("memberEnd")).value, 10);
    var moneyStart = parseInt((<HTMLInputElement> document.getElementById("moneyStart")).value, 10);
    var moneyEnd = parseInt((<HTMLInputElement> document.getElementById("moneyEnd")).value, 10);
    var city = (<HTMLInputElement> document.getElementById("city")).value;
    var data = {
      "type": typeList,
      "format": formatList,
      "dateTimeStart": timeStart,
      "dateTimeEnd": timeEnd,
      "minNumberOfGuests": memberStart,
      "maxNumberOfGuests": memberEnd,
      "minPrice": moneyStart,
      "maxPrice": moneyEnd,
      "location": city
    }
    console.log("sending data");
    this.httpClient.post<any>(BACKEND_URL + "/api/survey", data).subscribe(e=> {});
  }

}
