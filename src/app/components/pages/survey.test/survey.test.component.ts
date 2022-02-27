import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'survey.test',
  templateUrl: './survey.test.component.html',
  styleUrls: ['./survey.test.component.css']
})
export class SurveyTest implements OnInit {

  constructor() {
    console.log("work");
  }

  ngOnInit(): void {
  }

}
