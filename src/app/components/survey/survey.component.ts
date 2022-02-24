import { Component } from "@angular/core";

@Component({
    selector: 'survey-component',
    templateUrl: './survey.component.html',
    styleUrls: ['./survey.component.css']
})
export class SurveyComponent {
    reaction(event: Event): void {
        let buttonId = (event.target as Element).id
        if (buttonId === "survey-button-no") {
            document.getElementById("survey")!.remove();
        } else if (buttonId === "survey-button-yes") {
            console.log("yes");
        }
    }
}