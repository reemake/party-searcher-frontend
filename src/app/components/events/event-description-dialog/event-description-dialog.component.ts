import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Event} from "../../../entity/Event/Event";
import {User} from "../../../entity/User";
import {EventService} from "../../../services/event.service";
import {ChatService} from "../../../services/chat.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-event-description-dialog',
  templateUrl: './event-description-dialog.component.html',
  styleUrls: ['./event-description-dialog.component.css']
})
export class EventDescriptionDialogComponent implements OnInit {
public hasClose=true;
  public error:string;
  public userName=localStorage.getItem("username");
  public event:Event;
  constructor(   public dialogRef: MatDialogRef<EventDescriptionDialogComponent>,
                 @Inject(MAT_DIALOG_DATA) public data: Event,private eventService:EventService,private chatService:ChatService,private router:Router) {
    this.event=data;
  }

  ngOnInit(): void {
  }

  assignOnEvent(): void {
    if (this.event?.id !== undefined)
      this.eventService.assignOnEvent(this.event?.id,this.event.isOnline).subscribe(
        resp => {
          if (this.event !== null) {
            if(resp.url&&this.event.isOnline){
              this.event.url=resp.url;
            }
            this.event.currentUserEntered = true;
            var user = new User();
            user.login = localStorage.getItem("username") || '';
            this.event.guests.push({id: {userId: user.login, eventId: this.event.id || -1}})
          }
        }, error => {
          this.error = error.error.message?error.error.message:"Произошла ошибка при записи на событие";
        }
      )
  }

  removeFromEvent(): void {
    if (this.event?.id !== undefined)
      this.eventService.removeCurrentUserFromEvent(this.event.id)
        .subscribe(success => {
          if (this.event) {
            console.log(this.event)
            console.log(success)
            this.event.currentUserEntered = false;
            console.log(this.event.guests)
            this.event.guests = this.event.guests.filter(guest => guest.id.userId !== localStorage.getItem("username") || '');
            console.log(this.event.guests)
          }
        }, error1 => {
          alert("Произошла ошибка")
        })
  }

  callEventOwner(): void {
    if (this.event?.owner)
      this.chatService.createChatWithUser(this.event?.owner.login).subscribe(id => this.router.navigate(['/chat', {id: id}]));
  }


  complainOnEvent(): void {
    if (this.event  && this.event.id)
      this.router.navigateByUrl(`events/complaints/create?eventId=${this.event.id}`);
  }

  createAndGoToChat(): void {

    if (this.event !== null) {
      this.chatService.createChat(this.event).subscribe(chatId => {
        this.goToChat(chatId);
      });
    }
  }

  goToChat(id: number): void {
    this.router.navigate(['/chat', {id: id}]);
  }

  closeDescriptionFun(): void {
    this.dialogRef.close();
  }

}
