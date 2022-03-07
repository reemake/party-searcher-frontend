import {Component, OnInit} from '@angular/core';
import {Event} from "../../../../entity/Event/Event";
import {EventService} from "../../../../services/event.service";

@Component({
  selector: 'app-events-index',
  templateUrl: './events-index.component.html',
  styleUrls: ['./events-index.component.css']
})
export class EventsIndexComponent implements OnInit {

  public showMap: boolean = true;
  public events: Array<Event> = new Array();
  public currentActiveEvent: Event | null = null;
  public isList: boolean = false;

  constructor(private eventService: EventService) {

  }


  public userEventSelectHandler(eventsArray: Array<Event>) {
    if (eventsArray.length > 1) {
      this.isList = true;
      this.showMap = false;
      this.events = eventsArray;
    } else this.currentActiveEvent = eventsArray[0];
  }

  public onMapReady(event: any) {
    this.eventService.getEvents().subscribe(events => {
      this.events = events;
    })
  }

  ngOnInit(): void {
  }

}
