import {Component, OnDestroy, OnInit} from '@angular/core';
import {InviteService} from '../header/invite.service';
import {Invite} from '../header/invite';
import {HttpClient} from "@angular/common/http";
import {EventService} from "../../services/event.service";
import {NotificationService} from "../../services/notification.service";
import {Notification} from "../../entity/Notification";
import {ViewportScroller} from "@angular/common";
import {debounceTime, Subject} from "rxjs";

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit, OnDestroy {
  public notificationsSet = new WeakSet();
  public invites: Invite[];
  public inviteCheck: boolean = false;
  public inviteEl: Invite;
  public inviteDescription: boolean = false;
  public notifications: Notification[] = [];
  public shownNotification: Notification[] = [];
  public updateShown: Subject<Notification[]> = new Subject<Notification[]>();

  constructor(private inviteService: InviteService, private httpClient: HttpClient, private eventService: EventService, private notificationService: NotificationService, private scroller: ViewportScroller) {
    inviteService.getInvites().subscribe((data: Invite[]) => {
      this.invites = data;
      if (this.invites.length > 0) {
        this.inviteEl = this.invites[0];
        this.inviteCheck = true;
      } else this.inviteCheck = false;
    });
    this.notificationService.load().subscribe(notifications => {
      this.notifications = notifications;
    })
    this.updateShown.pipe(debounceTime(5000)).subscribe(notifications => {
      console.log(notifications)
      this.shownNotification = [];
      this.notificationService.setAsShown(notifications).subscribe(e => {

      }, error => alert("Ошибка при подключении к серверу"));
    })
  }

  ngOnInit(): void {
  }

  setNotificationAsRead(notification: Notification) {
    if (!this.notificationsSet.has(notification) && !notification.shown) {
      this.notificationsSet = this.notificationsSet.add(notification)
      this.shownNotification.push(notification);
      this.updateShown.next(this.shownNotification);
    }
  }

  public acceptClick(event: any): void {
    this.inviteCheck = false;
    this.eventService.assignOnEvent(event.path[0].id,false).subscribe(sucess=>{
      location.reload();
    });
  }

  public rejectClick(event: any): void {
    this.inviteCheck = false;
    var id: number = event.path[0].id;
    this.eventService.rejectInvite(id).subscribe();
    location.reload();
  }

  public detailsClick(event: Invite): void {
    this.inviteEl = event;
    console.log(this.inviteEl);
    this.inviteDescription = true;
  }

  public closeDescription(): void {
    this.inviteDescription = false;
  }

  ngOnDestroy(): void {
    this.updateShown.unsubscribe();
  }


}
