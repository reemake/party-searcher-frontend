import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Event} from "../../../entity/Event/Event";
import {FilterData} from "../../../entity/filterData";
import {EventService} from "../../../services/event.service";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, OnChanges {

  @Output() clickOnEvent: EventEmitter<Array<Event>> = new EventEmitter<Array<Event>>();
  @Output() openMapEvent: EventEmitter<FilterData> = new EventEmitter<FilterData>();

  @Input() filter: FilterData | null;
  @Input() events: Array<Event> = new Array<Event>();
  public filteredEvents: Array<Event> = new Array<Event>();
  public pages: number[] = [];
  public currentPage: number = 1;
  public size: number = 7;
  public pageCount: number = 0;
  public nameInput: FormControl = new FormControl();

  constructor(private eventService: EventService) {
    this.nameInput.valueChanges.subscribe(name => this.doLocalFiltering(name));
  }

  ngOnChanges(changes: SimpleChanges) {

  }

  public showDescription(event: Event): void {
    this.clickOnEvent.emit([event]);
  }

  public goToPage(pageNum: number): void {
    if (this.filter !== null)
      this.eventService.filterWithPaging(this.filter, pageNum - 1, this.size).subscribe(events => {
        this.filteredEvents = [];
        this.nameInput.setValue(null);
        this.pageCount = events.totalPages;
        this.currentPage = events.pageable.pageNumber + 1;
        this.events = events.content;
      });

  }

  public hasOffline(): boolean {
    return this.filter?.eventFormats?.filter(m => m === "OFFLINE").length == 1 && this.filter.eventFormats.length == 1
  }

  public increasePages(currentlastPage: number): void {
    if (this.pageCount - currentlastPage > 4) {
      this.generateArray(currentlastPage + 1, currentlastPage + 3);
    } else this.generateArray(currentlastPage + 1, this.pageCount);
  }

  public decreasePages(currentFirstPage: number): void {
    if (currentFirstPage - 1 > 4) {
      this.generateArray(currentFirstPage - 4, currentFirstPage - 1);
    } else this.generateArray(1, currentFirstPage - 1);
  }

  openMap(filter: any): void {
    this.openMapEvent.emit(filter);
  }

  private generateArray(begin: number, end: number): void {
    this.pages = [];
    for (let i = begin; i <= end && i <= this.pageCount; i++) {
      if (i >= 1)
        this.pages.push(i);
    }
  }

  public doLocalFiltering(name: string): void {
    this.filteredEvents = this.events.filter(e => e.name.indexOf(name) != -1);
  }

  private filterEvents(): void {
    if (this.filter !== null) {
      this.currentPage = 1;
      this.pageCount = 0;
      this.pages = [];
      this.eventService.filterWithPaging(this.filter, this.currentPage - 1, this.size).subscribe(events => {
        this.pageCount = events.totalPages;
        this.currentPage = events.pageable.pageNumber + 1;
        if (this.pageCount > 4) {
          this.generateArray(1, 4);
        } else this.generateArray(1, this.pageCount);
        this.filteredEvents = [];
        this.nameInput.setValue(null);
        this.events = events.content;
      });

      this.eventService.getVisitorsStats(this.events).subscribe(stats=>{
        const map = new Map(Object.entries(stats));
        this.events.forEach(e=>{
          if (e.id && map.has(Number(e.id).toString()))
            e.visitorsCount=map.get(Number(e.id).toString());
        })
      })
    }
  }

  ngOnInit(): void {
  }

}
