import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.css']
})
export class EventCreateComponent implements OnInit {
  private formGroup: FormGroup;
  private nameInput: FormControl = new FormControl();
  private descriptionInput: FormControl = new FormControl();
  private startTimeInput: FormControl = new FormControl();
  private startTimeEndInput: FormControl = new FormControl();
  private maxGuestsCountInput: FormControl = new FormControl();
  private priceInput: FormControl = new FormControl();
  private isPrivateInput: FormControl = new FormControl();
  private isOnlineInput: FormControl = new FormControl();
  private locationInput: FormControl = new FormControl();

  constructor() {
    this.formGroup = new FormGroup();
  }

  ngOnInit(): void {
  }

}
