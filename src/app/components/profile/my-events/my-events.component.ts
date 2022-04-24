import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/entity/User';
import { Event } from 'src/app/entity/Event/Event';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { EventService } from 'src/app/services/event.service';
import { UserService } from 'src/app/services/user.service';
import { FilterData } from 'src/app/entity/filterData';

@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.css']
})
export class MyEventsComponent implements OnInit {

  userLogin: string = localStorage.getItem("username") || '';
  user = new User();
  userEdited = new User();

  createdEvents: Array<Event>;
  attendedEvents: Array<Event>;

  descriptionOpened: boolean = false;
  viewingEvent: Event;

  constructor(private userService: UserService, 
              public authService: AuthenticationService, 
              private router: Router,
              private eventsService: EventService) {
    
   }

  ngOnInit(): void {
    this.getUserInfo();
    this.getUsersCreatedEvents();
    this.getUsersAttendedEvents();
  }

  getUserInfo() {
    this.userService.getUser(this.userLogin).subscribe(
      result => {
        this.user = result;
        console.log(this.user);
      },
      error => {
        console.log(error);
      }
    )
  }

  getUsersCreatedEvents() {
    this.eventsService.getUsersCreatedEventsByLogin(this.userLogin).subscribe(
      result => {
        this.createdEvents = result;
        console.log(this.createdEvents);
      },
      error => {
        console.log(error);
      }
    )
  }

  getUsersAttendedEvents() {
    this.eventsService.getUsersAttendedEventsByLogin(this.userLogin).subscribe(
      result => {
        this.attendedEvents = result;
        console.log(this.attendedEvents);
      },
      error => {
        console.log(error);
      }
    )
  }

  logOut() {
    this.authService.logOut();
  }

  showDescription(event: Event) {
    this.viewingEvent = event;
    this.descriptionOpened = true;
  }

  closeDescription() {
    this.descriptionOpened = false;
  }

}
