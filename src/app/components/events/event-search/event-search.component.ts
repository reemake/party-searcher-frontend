import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl} from "@angular/forms";
import {EventService} from "../../../services/event.service";

@Component({
  selector: 'app-event-search',
  templateUrl: './event-search.component.html',
  styleUrls: ['./event-search.component.css']
})
export class EventSearchComponent implements OnInit {

  @Output() closeSearch: EventEmitter<boolean> = new EventEmitter<boolean>();
  public words: string[] = ["artyom", "kok"];
  public eventTypes: string[] = ["all"];

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


  constructor(private eventService: EventService) {
  }

  ngOnInit(): void {
  }

  search(): void {

  }

  changeWords(): void {
    var value: string = this.wordsInput.value;
    var regExpMatchArray = value.match(new RegExp("[a-zа-я]+", "gi"));
    if (regExpMatchArray != null) {
      this.eventService.getWords(regExpMatchArray[regExpMatchArray.length - 1])
        .subscribe(words => {
          this.words = words;
        })
    }
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
