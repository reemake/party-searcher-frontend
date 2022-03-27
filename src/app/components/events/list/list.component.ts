import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Event} from "../../../entity/Event/Event";
import {FilterData} from "../../../entity/filterData";
import {EventService} from "../../../services/event.service";

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
  public pages: number[] = [];
  public currentPage: number = 1;
  public size: number = 7;
  public pageCount: number = 0;

  constructor(private eventService: EventService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['filter']) {
      if (changes['filter'].previousValue !== undefined)
        this.filterEvents();
    }
  }

  public showDescription(event: Event): void {
    this.clickOnEvent.emit([event]);
  }

  public goToPage(pageNum: number): void {
    if (this.filter !== null)
      this.eventService.filterWithPaging(this.filter, pageNum - 1, this.size).subscribe(events => {
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
    console.log(this.pages)
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

  private filterEvents(): void {
    console.log('FILTER')
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
        console.log(this.pages)
        this.events = events.content;
      });
    }
  }

  ngOnInit(): void {
  }

}
