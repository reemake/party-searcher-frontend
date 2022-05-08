import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Role } from 'src/app/entity/Role';
import { User } from 'src/app/entity/User';
import { Event } from 'src/app/entity/Event/Event';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { EventService } from 'src/app/services/event.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-events-history',
  templateUrl: './events-history.component.html',
  styleUrls: ['./events-history.component.css']
})
export class EventsHistoryComponent implements OnInit {

  userLogin: string = localStorage.getItem("username") || '';
  user = new User();

  allTimeEvents: Array<Event> = [];
  filteredEvents: Array<Event> = [];

  dateStart: Date;
  dateEnd: Date;

  constructor(private userService: UserService, public authService: AuthenticationService, private router: Router, private eventsService: EventService) { }

  ngOnInit(): void {
    this.getUserInfo();
    this.getAllTimeEvents();
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

  logOut() {
    this.authService.logOut();
  }

  isAdmin():boolean{
    return this.user.authorities!==undefined&&this.user.authorities.filter(e=>e===Role.ADMIN).length>0;
  }

  getAllTimeEvents() {
    this.eventsService.getEndedEvents().subscribe(
      result => {
        this.allTimeEvents = result;
        console.log(this.allTimeEvents);
      },
      error => {
        console.log(error);
      }
    )
  }

  filter() {
    console.log("filtering...");
    console.log(this.dateStart);
    console.log(this.dateEnd);
    var d1 = new Date(this.dateStart);
    var d2 = new Date(this.dateEnd);
    this.eventsService.getEndedEventsInInterval(d1.toISOString(), d2.toISOString()).subscribe(
      result => {
        this.filteredEvents = result;
        console.log(this.filteredEvents);
      },
      error => {
        console.log(error);
      }
    )
  }

}
