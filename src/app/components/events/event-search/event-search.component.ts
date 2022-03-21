import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl} from "@angular/forms";
import {EventService} from "../../../services/event.service";
import {FilterData} from "../../../entity/filterData";
import {Event} from "../../../entity/Event/Event";
import {AppModule} from "../../../app.module";

@Component({
  selector: 'app-event-search',
  templateUrl: './event-search.component.html',
  styleUrls: ['./event-search.component.css']
})
export class EventSearchComponent implements OnInit {

  @Input() userLocation: number[] = [];
  @Output() closeSearch: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() eventsSearched: EventEmitter<Array<Event>> = new EventEmitter<Array<Event>>();
  public words: string[] = ["artyom", "kok"];
  public eventTypes: string[] = [];

  public wordsInput: FormControl = new FormControl();
  public eventLengthFromInput: FormControl = new FormControl();
  public eventLengthMeasureFromInput: FormControl = new FormControl();
  public eventLengthToInput: FormControl = new FormControl();
  public eventLengthMeasureToInput: FormControl = new FormControl();
  public eventBeginTimeInput: FormControl = new FormControl();
  public eventEndTimeInput: FormControl = new FormControl();
  public guestsCountFromInput: FormControl = new FormControl();
  public guestsCountToInput: FormControl = new FormControl();
  public priceFromInput: FormControl = new FormControl();
  public priceToInput: FormControl = new FormControl();
  public eventThemeInput: FormControl = new FormControl();
  public maxDistanceInput: FormControl = new FormControl();
  public ratingInput: FormControl = new FormControl();
  public eventFormatInput: FormControl = new FormControl();
  public eventTypeInput: FormControl = new FormControl();
  public distanceMeasureInput: FormControl = new FormControl();
  public freeEventInput: FormControl = new FormControl();

  constructor(private eventService: EventService) {
  }

  ngOnInit(): void {
    this.eventService.getTypes().subscribe(types => {
      this.eventTypes = types.map(event => event.name);
    });
  }

  search(): void {
    console.log("YOU TRY TO SEARCH " + AppModule.HAS_AUTH);
    var numbers = this.setTimeLength();
    var formats = [];
    switch (this.eventFormatInput.value) {
      case "offline":
        formats.push("OFFLINE");
        break;
      case "online":
        formats.push("ONLINE");
        break;
      case "all":
        formats.push("OFFLINE", "ONLINE");
        break;
    }
    var distance: number = 0;
    switch (this.distanceMeasureInput.value) {
      case "METRES":
        distance = this.maxDistanceInput.value;
        break;
      case "KILOMETERS":
        distance = this.maxDistanceInput.value * 1000;
        break;
    }
    console.log("WORD=" + this.wordsInput.value);
    console.log(this.freeEventInput.value);
    var filterData: FilterData = {
      keyWords: this.wordsInput.value !== null ? (String(this.wordsInput.value).trim().split(" ")) : [],
      eventType: this.eventTypeInput.value ? {name: this.eventTypeInput.value} : null,
      eventBeginTimeFrom: this.eventBeginTimeInput.value,
      eventBeginTimeTo: this.eventEndTimeInput.value,
      eventLengthFrom: numbers[0],
      eventLengthTo: numbers[1],
      guestsCountFrom: this.guestsCountFromInput.value,
      guestsCountTo: this.guestsCountToInput.value,
      priceFrom: this.priceFromInput.value,
      priceTo: this.priceToInput.value,
      theme: this.eventThemeInput.value,
      maxDistance: distance / Math.pow(10, 5),
      eventOwnerRating: this.ratingInput.value,
      userLocation: this.userLocation,
      eventFormats: formats,
      freeEvents: this.freeEventInput.value
    };
    this.eventService.filter(filterData).subscribe(e =>
      this.eventsSearched.emit(e));
  }

  changeWords(): void {
    console.log("has auth =" + AppModule.HAS_AUTH);
    var value: string = this.wordsInput.value;
    var regExpMatchArray = value.match(new RegExp("[a-zа-я]+", "gi"));
    if (regExpMatchArray != null) {
      this.eventService.getWords(regExpMatchArray[regExpMatchArray.length - 1])
        .subscribe(words => {
          this.words = words;
        })
    }
  }

  private setTimeLength(): number[] {
    var begin = 0;
    var end = 0;
    begin = this.eventLengthFromInput.value;
    end = this.eventLengthToInput.value;
    var beginMeasure = this.eventLengthMeasureFromInput.value;
    var endMeasure = this.eventLengthMeasureToInput.value;

    switch (beginMeasure) {
      case "hours":
        begin = begin * 60;
        break;
      case "days":
        begin = begin * 60 * 24;
        break;
    }

    switch (endMeasure) {
      case "hours":
        end = end * 60;
        break;
      case "days":
        end = end * 60 * 24;
        break;
    }
    return [begin, end];
  }

  setWords(word: string) {
    var value: string = this.wordsInput.value;
    var regExpMatchArray = value.match(new RegExp("[a-zа-я]+", "gi"));
    if (regExpMatchArray != null) {
      regExpMatchArray[regExpMatchArray.length - 1] = word;
      value = regExpMatchArray.join(" ");
      this.wordsInput.setValue(value);
    }
  }


}
