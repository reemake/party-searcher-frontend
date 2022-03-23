import {Component, OnInit} from '@angular/core';
import {Event} from "../../../../entity/Event/Event";
import {EventService} from "../../../../services/event.service";
import {AppModule} from "../../../../app.module";

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
  public mapSize: string = "100%";
  public isSearchActive: boolean = false;
  private prevMapSize: string = "100%";
  public currentLocation: number[] = [];

  constructor(private eventService: EventService) {

  }


  public userEventSelectHandler(eventsArray: Array<Event>) {
    if (eventsArray.length > 1) {
      this.isList = true;
      this.showMap = false;
      this.events = eventsArray;
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
    this.eventService.getEvents().subscribe(events => {
      this.events = events;
    })
  }

  public onCallSearch(event: any): void {
    console.log(AppModule.HAS_AUTH);
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

  ngOnInit(): void {
  }

}
