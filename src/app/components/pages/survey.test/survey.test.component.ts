import { Component, OnInit } from '@angular/core';
import { TypesService } from '../../types.service';
import { TypeComponent } from '../../type/type.component';

@Component({
  selector: 'survey.test',
  templateUrl: './survey.test.component.html',
  styleUrls: ['./survey.test.component.css']
})
export class SurveyTest implements OnInit {

  types: TypeComponent[] = [];
  constructor(private typesService: TypesService) {
    console.log("work");
  }

  ngOnInit(): void {
    this.typesService.getTypes().subscribe((data: TypeComponent[]) => {
      console.log(data);
      this.types = data;
    });
  }

}
