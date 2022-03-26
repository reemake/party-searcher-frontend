import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {Event} from "../../../entity/Event/Event";
import {EventService} from "../../../services/event.service";
import {Tag} from "../../../entity/Event/Tag";

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.css']
})
export class EventCreateComponent implements OnInit {
  public events: Array<Event> = new Array<Event>();
  public event: Event | null = null;
  private currentDistance = 0;
  public tagsCount: number = 0;
  public formGroup: FormGroup;
  public nameInput: FormControl = new FormControl();
  public descriptionInput: FormControl = new FormControl();
  public startTimeInput: FormControl = new FormControl();
  public endTimeInput: FormControl = new FormControl();
  public maxGuestsCountInput: FormControl = new FormControl();
  public priceInput: FormControl = new FormControl();
  public isPrivateInput: FormControl = new FormControl();
  public isOnlineInput: FormControl = new FormControl();
  public locationInput: FormControl = new FormControl();
  public urlInput: FormControl = new FormControl();
  public eventThemeInput: FormControl = new FormControl();
  public eventTypeInput: FormControl = new FormControl();
  public error: string = "";
  public currentLocation: number[] = [];
  public eventTypes: string[] = [];

  public tagsInputs: Array<FormControl> = new Array<FormControl>();

  constructor(private eventService: EventService) {
    this.locationInput.disable();
    this.formGroup = new FormGroup({
      name: this.nameInput,
      description: this.descriptionInput,
      startTime: this.startTimeInput,
      endTime: this.endTimeInput,
      maxGuests: this.maxGuestsCountInput,
      price: this.priceInput,
      isPrivate: this.isPrivateInput,
      isOnline: this.isOnlineInput,
      location: this.locationInput,
      url: this.urlInput,
      theme: this.eventThemeInput,
      type: this.eventTypeInput
    });

  }

  selectEvents(event: any): void {
    console.log(event)
    this.event = event;
  }

  changeMapBounds(event: any): void {

    if (this.currentLocation !== event[0]) {
      this.eventService.getEventsWithinRadius(event[0], event[1]).subscribe((events: Event[]) => {
        this.events = events;
      });
    } else if (this.currentDistance < event[1]) {
      this.eventService.getEventsWithinRadius(this.currentLocation, event[1]).subscribe((events: Event[]) => {
        this.events = events;
        this.currentDistance = event[1];
      });
    } else if (this.currentDistance > event[1] * 1.999) {

    }
  }

  addTag(): void {
    let tag: FormControl = new FormControl();
    this.tagsInputs.push(tag);
    this.formGroup.addControl(String("tag" + this.tagsInputs.length), tag);
  }

  submit(): void {
    let event: Event = {
      description: this.descriptionInput.value,
      theme: this.eventThemeInput.value,
      name: this.nameInput.value,
      eventType: {name: this.eventTypeInput.value},
      isOnline: this.isOnlineInput.value,
      isPrivate: this.isPrivateInput.value,
      url: this.isOnlineInput.value ? this.urlInput.value : null,
      dateTimeStart: this.startTimeInput.value,
      dateTimeEnd: this.endTimeInput.value,
      maxNumberOfGuests: this.maxGuestsCountInput.value,
      price: this.priceInput.value,
      tags: [],
      guests: []
    };
    this.tagsInputs.forEach(val => {
      let tag: Tag = {name: String(val.value).toUpperCase()};
      event.tags.push(tag);
    });
    if (!event.isOnline) {
      event.location = {
        name: "",
        location: {
          type: "Point",
          coordinates: this.currentLocation
        }
      };
      console.log("first \n" + event);
      this.eventService.setAddressByLonLat(event, () => {
        console.log(event);
        this.eventService.add(event).subscribe(event => {

        }, error => {
          alert("При создании эвента произошла ошибка, повторите еще раз");
          this.error = error;
        });
      });
    } else

      this.eventService.add(event).subscribe(event => {

      }, error => {
        this.error = error;
      });
  }

  remove(control: FormControl): void {
    this.tagsInputs = this.tagsInputs.filter(tag => tag !== control);
  }


  ngOnInit(): void {
    this.eventService.getTypes().subscribe(types => {
        this.eventTypes = types.map(event => event.name);
      }, error1 => {
        console.log("GIVE ERROR");
        alert("При загрузке типов мероприятий произошла ошибка, повторите еще раз")
      }
    );
  }

}
