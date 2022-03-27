import { Component } from "@angular/core";
import {HttpClient} from "@angular/common/http";
import { BACKEND_URL } from 'src/app/app.module';

@Component({
    selector: 'survey-component',
    templateUrl: './survey.component.html',
    styleUrls: ['./survey.component.css']
})
export class SurveyComponent {
    surveyButton: boolean = false;

    constructor(private http: HttpClient) {
      if (globalThis.HAS_AUTH) {
        this.http.get<boolean>(BACKEND_URL + "/api/surveyCheck")
        .subscribe((checkResult: boolean) => {
          this.surveyButton = checkResult;
        });
      }
    }

    public surveyButtonPress(): void {
      this.surveyButton = !this.surveyButton;
    }
}