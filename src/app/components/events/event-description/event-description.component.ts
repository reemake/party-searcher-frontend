import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Event} from "../../../entity/Event/Event";
import {EventService} from "../../../services/event.service";
import {User} from "../../../entity/User";
import {ChatService} from "../../../services/chat.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-event-description',
  templateUrl: './event-description.component.html',
  styleUrls: ['./event-description.component.css']
})
export class EventDescriptionComponent implements OnInit {
  @Output() public closeDescription: EventEmitter<any> = new EventEmitter<any>();
  @Input() public event: Event | null;
  public error: string = "";

  constructor(private eventService: EventService, private chatService: ChatService, private router: Router) {
  }

  ngOnInit(): void {
  }

  assignOnEvent(): void {
    if (this.event?.id !== undefined)
      this.eventService.assignOnEvent(this.event?.id).subscribe(
        resp => {
          if (this.event !== null) {
            this.event.currentUserEntered = true;
            var user = new User();
            user.login = resp.response;
            this.event.guests.push({user: user})
          }
        }, error => {
          this.error = "Произошла ошибка при записи на событие";
        }
      )
  }

  removeFromEvent(): void {
    if (this.event?.id !== undefined)
      this.eventService.removeCurrentUserFromEvent(this.event.id)
        .subscribe(success => {
          if (this.event) {
            console.log(success)
            this.event.currentUserEntered = false;
            console.log(this.event.guests)
            this.event.guests = this.event.guests.filter(guest => guest.user.login !== success.response);
            console.log(this.event.guests)
          }
        }, error1 => {
          alert("Произошла ошибка")
        })
  }

  callEventOwner(): void {

  }


  complainOnEvent(): void {

  }

  createAndGoToChat(): void {
    if (this.event !== null)
      this.chatService.createChat(this.event).subscribe(chatId => {
        this.goToChat(chatId);
      });
  }

  goToChat(id: number): void {
    this.router.navigate(['/chat', {id: id}]);
  }

  closeDescriptionFun(): void {
    this.event = null;
    this.closeDescription.next({});
  }

}
