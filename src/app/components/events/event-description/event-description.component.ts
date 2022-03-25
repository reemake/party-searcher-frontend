import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Event} from "../../../entity/Event/Event";
import {EventService} from "../../../services/event.service";

@Component({
  selector: 'app-event-description',
  templateUrl: './event-description.component.html',
  styleUrls: ['./event-description.component.css']
})
export class EventDescriptionComponent implements OnInit {
  @Output() public closeDescription: EventEmitter<any> = new EventEmitter<any>();
  @Input() public event: Event | null;
  public error: string = "";

  constructor(private eventService: EventService) {
  }

  ngOnInit(): void {
  }

  assignOnEvent(): void {
    if (this.event?.id !== undefined)
      this.eventService.assignOnEvent(this.event?.id).subscribe(
        resp => {
          if (this.event !== null)
            this.event.currentUserEntered = true;
        }, error => {
          this.error = "Произошла ошибка при записи на событие";
        }
      )
  }

  callEventOwner(): void {

  }


  complainOnEvent(): void {

  }

  closeDescriptionFun(): void {
    console.log(this.event);
    this.event = null;
    this.closeDescription.next({});
  }

}
