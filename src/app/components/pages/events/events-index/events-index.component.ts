import {Component, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {Event} from "../../../../entity/Event/Event";

@Component({
  selector: 'app-events-index',
  templateUrl: './events-index.component.html',
  styleUrls: ['./events-index.component.css']
})
export class EventsIndexComponent implements OnInit {
  public subject: Subject<Array<Event>> = new Subject();

  constructor() {

  }

  public onMapReady(event: any) {
    this.subject.next([
      {
        id: 1,
        description: "abcd",
        name: "aecd",
        isOnline: true,
        location: {
          name: "vrn",
          lat: 39.184,
          lon: 51.672
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
        participationCount: 400,
        url: null

      }]);
  }

  ngOnInit(): void {
  }

}
