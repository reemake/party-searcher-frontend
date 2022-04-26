import {Component, OnInit, ViewChild} from '@angular/core';
import {Event} from "../../../entity/Event/Event";
import {EventService} from "../../../services/event.service";
import {FilterData} from "../../../entity/filterData";
import {MapComponent} from "../../map/map.component";
import * as olSphere from "ol/sphere";
import {debounceTime, Observable, Subject as Subj} from "rxjs";

type Subject = Observable<any>;

@Component({
  selector: 'app-events-index',
  templateUrl: './events-index.component.html',
  styleUrls: ['./events-index.component.css']
})
export class EventsIndexComponent implements OnInit {
  @ViewChild(MapComponent) childMap: MapComponent;
  public filter: FilterData | null = null;
  public showMap: boolean = true;
  public eventsId: Set<number> = new Set<number>();
  public events: Array<Event> = new Array<Event>();
  public currentActiveEvent: Event | null = null;
  public isList: boolean = false;
  public mapSize: string = "100%";
  public isSearchActive: boolean = false;
  private prevMapSize: string = "100%";
  public currentLocation: number[] = [];
  public changeMapBounds = new Subj<any>();

  private currentDistance: number = 0;
  private maxSW: number[] = [];
  private maxNE: number[] = [];
  private settedFilter = false;

  constructor(private eventService: EventService) {
    this.changeMapBounds.pipe(
      debounceTime(500)
    ).subscribe(event => {
      if (this.isSWandNEmore(event[2], event[3]) && !this.settedFilter) {
        this.eventService.getEventsWithinRadius(event[0], event[1])
          .subscribe((events: Event[]) => {
            console.log(events);
            this.events = events;
            this.currentLocation = event[0];
          });
      }

    })
  }


  public userEventSelectHandler(eventsArray: Array<Event>) {
    if (eventsArray.length > 1) {
      this.events = eventsArray
      if (this.filter == null)
        this.filter = {
          eventFormats: ['OFFLINE']
        }
      else
        this.filter.eventFormats = ['OFFLINE'];
      this.filter.userLocation = this.currentLocation
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
    console.log(event)
    this.currentLocation = event;
  }

  public showList(event: any): void {
    if (event) {

      if (this.filter == null)
        this.filter = {
          eventFormats: ['OFFLINE']
        }
      else
        this.filter.eventFormats = ['OFFLINE'];
      this.filter.userLocation = this.currentLocation
      this.showMap = false;
    } else {

      this.showMap = true;
    }
  }

  public doOpenMap(event: any): void {
    this.eventService.filter(event).subscribe(
      events => {
        this.events = events;
        this.events.forEach(event => {
          if (event.location) {
            var centerToSW = olSphere.getDistance(event.location?.location.coordinates, this.currentLocation);
            if (centerToSW > this.currentDistance) {
              this.currentDistance = centerToSW;
            }
          }
        });
        this.showMap = true;
      });
  }


  private isSWandNEmore(SW: number[], NE: number[]): boolean {
    if (this.maxNE.length == 0 || this.maxSW.length == 0) {
      this.maxNE = NE;
      this.maxSW = SW;
      return true;
    } else {
      if (SW[0] < this.maxSW[0] || SW[1] < this.maxSW[0] || NE[0] > this.maxNE[0] || NE[1] > this.maxNE[1]) {
        this.maxNE = NE;
        this.maxSW = SW;
        return true;

      } else return false;
    }
  }

  private isLocationIsInBounds(point: number[], SW: number[], NE: number[]): boolean {
    if (point[0] > SW[0] && point[1] > SW[1] && point[0] < NE[0] && point[1] < NE[1])
      return true;
    return false;
  }

  public search(events: Array<Event>): void {
    console.log(events)
    this.settedFilter = true;
    if (this.filter?.eventFormats && this.filter?.eventFormats?.filter(e => e === "ONLINE").length > 0) {
      this.showMap = false;

    }
    this.events = events;
  }

  ngOnInit(): void {
  }

}
