import { Component } from "@angular/core";

import { Router } from "@angular/router";

@Component({
    selector: 'survey-component',
    templateUrl: './survey.component.html',
    styleUrls: ['./survey.component.css']
})
export class SurveyComponent {
    surveyButton: boolean = true;
    public surveyButtonPress(): void {
      this.surveyButton = !this.surveyButton;
    }
}