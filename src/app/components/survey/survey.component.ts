import { Component } from "@angular/core";

@Component({
    selector: 'survey-component',
    templateUrl: './survey.component.html',
    styleUrls: ['./survey.component.css']
})
export class SurveyComponent {
    surveyButton: boolean;

    constructor() {
      if (globalThis.HAS_AUTH) { this.surveyButton = true; }
      else { this.surveyButton = false; }
    }

    public surveyButtonPress(): void {
      this.surveyButton = !this.surveyButton;
    }
}