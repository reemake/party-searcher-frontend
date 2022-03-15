import { Component, OnInit } from '@angular/core';
import { TypesService } from '../../types.service';
import { TypeComponent } from '../../type/type.component';
import { FormControl } from '@angular/forms';

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

  constructor(private typesService: TypesService) {
  }

  ngOnInit(): void {
    this.typesService.getTypes().subscribe((data: TypeComponent[]) => {
      this.types = data;
    });
  }

  public click(): void {
    var type = document.getElementsByName("type");
    this.checkType = false;
    for (var i = 0; i < type.length; i++) {
      if ((<HTMLInputElement> (type[i])).checked) {
        this.checkType = true;
      }
    }

    var format = document.getElementsByName("format");
    this.checkFormat = false;
    for (var i = 0; i < format.length; i++) {
      if ((<HTMLInputElement> (format[i])).checked) {
        this.checkFormat = true;
      }
    }
    var date = document.getElementsByClassName("radio-area-time");
    this.checkDate = false;
    if ((<HTMLInputElement> (date[0])).value && (<HTMLInputElement> (date[1])).value) { this.checkDate = true; }
    var textFields = document.getElementsByClassName("surveyTest-textarea");
    this.checkTextFields = true;
    for (var i = 0; i < textFields.length; i++) {
      if ((<HTMLInputElement> (textFields[i])).value === "") {
        this.checkTextFields = false;
      }
    }
    if (this.checkType && this.checkFormat && this.checkDate && this.checkTextFields) {location.href = "/";}
    else {alert("Необходимо заполнить все поля")}
  }

}
