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
  public error: string = "";

  public tagsInputs: Array<FormControl> = new Array<FormControl>();

  constructor(private eventService: EventService) {
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
      theme: this.eventThemeInput
    });

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
      let tag: Tag = {name: String(val.value).trim().toUpperCase()};
      event.tags.push(tag);
    });
    console.log("add");
    this.eventService.add(event).subscribe(event => {

    }, error => {
      this.error = error;
    });
  }


  ngOnInit(): void {
  }

}
