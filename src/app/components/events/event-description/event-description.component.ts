import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Event} from "../../../entity/Event/Event";
import {AppModule} from "../../../app.module";

@Component({
  selector: 'app-event-description',
  templateUrl: './event-description.component.html',
  styleUrls: ['./event-description.component.css']
})
export class EventDescriptionComponent implements OnInit {
  @Output() public closeDescription: EventEmitter<any> = new EventEmitter<any>();
  @Input() public event: Event | null = null;

  constructor() {
  }

  ngOnInit(): void {
  }

  assignOnEvent(): void {

  }

  callEventOwner(): void {

  }


  complainOnEvent(): void {

  }

  closeDescriptionFun(): void {
    console.log(AppModule.HAS_AUTH);
    this.event = null;
    this.closeDescription.next({});
  }

}
