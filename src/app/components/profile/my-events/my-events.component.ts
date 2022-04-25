import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/entity/User';
import { Event } from 'src/app/entity/Event/Event';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { EventService } from 'src/app/services/event.service';
import { UserService } from 'src/app/services/user.service';
import { FilterData } from 'src/app/entity/filterData';
import { ChatService } from 'src/app/services/chat.service';

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
              private eventsService: EventService,
              private chatService: ChatService) {
    
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

  assignOnEvent(): void {
    if (this.viewingEvent?.id !== undefined)
      this.eventsService.assignOnEvent(this.viewingEvent?.id).subscribe(
        resp => {
          if (this.viewingEvent !== null) {
            this.viewingEvent.currentUserEntered = true;
            var user = new User();
            user.login = localStorage.getItem("username") || '';
            this.viewingEvent.guests.push({id: {userId: user.login, eventId: this.viewingEvent.id || -1}})
          }
        }, error => {
          alert("Произошла ошибка при записи на событие");
        }
      )
  }


  removeFromEvent(): void {
    if (this.viewingEvent?.id !== undefined)
      this.eventsService.removeCurrentUserFromEvent(this.viewingEvent.id)
        .subscribe(success => {
          if (this.viewingEvent) {
            console.log(this.viewingEvent)
            console.log(success)
            this.viewingEvent.currentUserEntered = false;
            console.log(this.viewingEvent.guests)
            this.viewingEvent.guests = this.viewingEvent.guests.filter(guest => guest.id.userId !== localStorage.getItem("username") || '');
            console.log(this.viewingEvent.guests)
          }
        }, error1 => {
          alert("Произошла ошибка")
        })
  }

  callEventOwner(): void {
    if (this.viewingEvent?.owner)
      this.chatService.createChatWithUser(this.viewingEvent?.owner.login).subscribe(id => this.router.navigate(['/chat', {id: id}]));
  }


  complainOnEvent(): void {

  }

  createAndGoToChat(): void {

    if (this.viewingEvent !== null) {
      this.chatService.createChat(this.viewingEvent).subscribe(chatId => {
        this.goToChat(chatId);
      });
    }
  }

  goToChat(id: number): void {
    this.router.navigate(['/chat', {id: id}]);
  }

}
