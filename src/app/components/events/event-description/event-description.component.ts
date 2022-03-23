import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Event} from "../../../entity/Event/Event";
import {AuthenticationService} from "../../../services/auth/authentication.service";

@Component({
  selector: 'app-event-description',
  templateUrl: './event-description.component.html',
  styleUrls: ['./event-description.component.css']
})
export class EventDescriptionComponent implements OnInit {
  @Output() public closeDescription: EventEmitter<any> = new EventEmitter<any>();
  @Input() public event: Event | null = null;

  constructor(private auth: AuthenticationService) {
  }

  ngOnInit(): void {
  }

  assignOnEvent(): void {

  }

  callEventOwner(): void {

  }


  complainOnEvent(): void {

  }

  closeDescriptionFun(): void {
    console.log(this.auth.isAuth());
    this.event = null;
    this.closeDescription.next({});
  }

}
