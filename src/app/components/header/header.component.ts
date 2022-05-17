import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from 'src/app/services/auth/authentication.service';
import {InviteService} from './invite.service';
import {NotificationService} from "../../services/notification.service";
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/entity/User';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public invitesCheck: boolean = false;
  public authCheck: boolean = false;

  constructor(private _router: Router, public _authService: AuthenticationService, private inviteService: InviteService, private notificationService: NotificationService, public userService: UserService) {
    if (localStorage.getItem("token")) {
      inviteService.isInvated().subscribe((data) => {
        this.invitesCheck = data;
      });
      this.notificationService.hasNew().subscribe(e => {
        if (e) {
          this.invitesCheck = e;
        }
      })
    }
    setInterval(() => {
      if (localStorage.getItem("token")) {
        inviteService.isInvated().subscribe((data) => {
          this.invitesCheck = data;
        });
        this.notificationService.hasNew().subscribe(e => {
          if (e) {
            this.invitesCheck = e;
          }
        })
      }
    }, 60000);



    this._authService.checkAuth().subscribe(
      result => {
        console.log("auth");
        this.authCheck = true;
      },
      error => {
        console.log("not auth");
        this.authCheck = false;
      }
    )
  }

  public invateCheck(): void {
    if (localStorage.getItem("token")) {
      this.inviteService.isInvated().subscribe((data) => {
        this.invitesCheck = data;
      });
    }
  }

  public logOut(): void {
    this._authService.logOut();
    this.authCheck = false;
  }

  ngOnInit(): void {
    this._authService.changeAuth().subscribe(res=>{
      console.log(`status change =${res}`);
      if (res){
        this.authCheck=true;
      }
    })
  }

}
