import {Component, OnInit} from '@angular/core';
import {Event} from "../../../../entity/Event/Event";
import {EventAttendance} from "../../../../entity/Event/EventAttendance";

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

  constructor() {

  }


  public userEventSelectHandler(eventsArray: Array<Event>) {
    if (eventsArray.length > 1) {
      this.isList = true;
      this.showMap = false;
      this.events = eventsArray;
    } else this.currentActiveEvent = eventsArray[0];
  }

  public onMapReady(event: any) {
    this.events = [
      {
        id: 1,
        description: "abcd",
        name: "aecd",
        isOnline: false,
        location: {
          name: "vrn",
          lat: 51.68405100623913,
          lon: 39.26342010498047
        },
        dateTimeStart: new Date(),
        dateTimeEnd: new Date(),
        maxNumberOfGuests: 30,
        price: 1000,
        owner: {
          login: "pupkin",
          id: 1,
          rating: 2
        },
        chatId: 300,
        currentUserEntered: true,
        tags: [],
        guests: new Array<EventAttendance>(),
        url: null

      }];
  }

  ngOnInit(): void {
  }

}
