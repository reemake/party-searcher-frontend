import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/entity/User';
import { Event } from 'src/app/entity/Event/Event';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { EventService } from 'src/app/services/event.service';
import { UserService } from 'src/app/services/user.service';
import { FilterData } from 'src/app/entity/filterData';
import { ChatService } from 'src/app/services/chat.service';
import { Role } from 'src/app/entity/Role';

@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.css']
})
export class MyEventsComponent implements OnInit {

  userLogin: string = localStorage.getItem("username") || '';
  user = new User();

  createdEvents: Array<Event> = [];
  attendedEvents: Array<Event> = [];

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

  callEventOwner(): void {
    if (this.viewingEvent?.owner)
      this.chatService.createChatWithUser(this.viewingEvent?.owner.login).subscribe(id => this.router.navigate(['/chat', {id: id}]));
  }


  complainOnEvent(): void {
    if (this.viewingEvent  && this.viewingEvent.id)
    this.router.navigateByUrl(`events/complaints/create?eventId=${this.viewingEvent.id}`);
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

  editEvent(event: Event) {
    this.router.navigate(['/events/edit'], { queryParams: {id: event.id}})
  }

  deleteEvent(eventId: number) {
    var isConfirmed = confirm("Удалить мероприятие?");
    if (isConfirmed) {
      this.eventsService.removeEvent(eventId).subscribe(
        result => {
          console.log('event successfully deleted');
          alert("Мероприятие успешно удалено");
          window.location.reload();
        },
        error => {
          console.log('error while deleting event');
          console.log(error);
          alert("При удалении мероприятия произошла ошибка");
        }
      )
    }
  
  }

  removeFromEvent(event: Event): void {
    var isConfirmed = confirm("Отказаться от участия в данном мероприятии?");
    if (isConfirmed) {
      this.eventsService.removeCurrentUserFromEvent(event.id!).subscribe(
        result => {
          console.log("user successfully removed from event");
          alert("Вы успешно отменили свое участие в данном мероприятии");
          window.location.reload();
        }, 
        error => {
          alert("Произошла ошибка");
        })
    }
  }

  isAdmin():boolean{
    return this.user.authorities!==undefined&&this.user.authorities.filter(e=>e===Role.ADMIN).length>0;
  }

}
