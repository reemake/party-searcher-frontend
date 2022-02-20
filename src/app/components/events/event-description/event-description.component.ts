import {Component, Input, OnInit} from '@angular/core';
import {Event} from "../../../entity/Event/Event";

@Component({
  selector: 'app-event-description',
  templateUrl: './event-description.component.html',
  styleUrls: ['./event-description.component.css']
})
export class EventDescriptionComponent implements OnInit {
  @Input() public event: Event | null = null;

  constructor() {
  }

  ngOnInit(): void {
  }

}
