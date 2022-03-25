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
  public events: Set<Event> = new Set<Event>();
  public currentActiveEvent: Event | null = null;
  public isList: boolean = false;
  public mapSize: string = "100%";
  public isSearchActive: boolean = false;
  private prevMapSize: string = "100%";
  public currentLocation: number[] = [];

  private currentDistance: number = 0;


  constructor(private eventService: EventService) {

  }


  public userEventSelectHandler(eventsArray: Array<Event>) {
    if (eventsArray.length > 1) {
      this.isList = true;
      this.showMap = false;
    } else if (eventsArray.length == 1) {
      this.currentActiveEvent = eventsArray[0];
      this.prevMapSize = this.mapSize;
      this.mapSize = "80%";
    } else {
      this.mapSize = this.prevMapSize;
      this.currentActiveEvent = null;
    }
  }

  public onMapReady(event: any) {
  }

  public onCallSearch(event: any): void {
    if (event) {
      this.isSearchActive = true;
      this.prevMapSize = this.mapSize;
      this.mapSize = "70%";
    } else {
      this.isSearchActive = false;
      this.mapSize = this.prevMapSize;
    }
  }

  public changeLoc(event: any): void {
    this.currentLocation = event;
  }

  public changeMapBounds(event: any): void {

    if (this.currentLocation !== event[0]) {
      this.eventService.getEventsWithinRadius(event[0], event[1]).subscribe((events: Event[]) => {
        events.forEach(event => this.events = this.events.add(event));
        this.currentLocation = event[0];
      });
    } else if (this.currentDistance < event[1]) {
      this.eventService.getEventsWithinRadius(this.currentLocation, event[1]).subscribe((events: Event[]) => {
        events.forEach(event => this.events = this.events.add(event));
        this.currentDistance = event[1]
      });
    } else if (this.currentDistance > event[1] * 1.999) {

    }
  }

  public search(events: Array<Event>): void {

  }

  ngOnInit(): void {
  }

}
