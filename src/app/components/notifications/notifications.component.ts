import { Component, OnInit } from '@angular/core';
import { InviteService } from '../header/invite.service';
import { Invite } from '../header/invite';
import { HttpClient } from "@angular/common/http";
import { EventService } from "../../services/event.service";

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  public invites: Invite[];
  public inviteCheck: boolean = false;
  public inviteEl: Invite;
  public inviteDescription: boolean = false;

  constructor(private inviteService: InviteService, private httpClient: HttpClient, private eventService: EventService) {
    inviteService.getInvites().subscribe((data: Invite[]) => {
      this.invites = data;
      if (this.invites.length > 0) {
        this.inviteEl = this.invites[0];
        this.inviteCheck = true;
      }
      else this.inviteCheck = false;
    });
  }

  ngOnInit(): void {
  }

  public acceptClick(event: any): void {
    this.inviteCheck = false;
    this.eventService.assignOnEvent(event.path[0].id).subscribe();
    location.reload();
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

}
