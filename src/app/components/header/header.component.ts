import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from 'src/app/services/auth/authentication.service';
import {InviteService} from './invite.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public invitesCheck: boolean = false;

  constructor(private _router: Router, public _authService: AuthenticationService, private inviteService: InviteService) {
    if (localStorage.getItem("token")) {
      inviteService.isInvated().subscribe((data) => {
        this.invitesCheck = data;
      });
    }
    setInterval(() => {
      if (localStorage.getItem("token")) {
        inviteService.isInvated().subscribe((data) => {
          this.invitesCheck = data;
        });
      }
    }, 60000);
  }

  public invateCheck(): void {
    if (localStorage.getItem("token")) {
      this.inviteService.isInvated().subscribe((data) => {
        this.invitesCheck = data;
      });
    }
  }

  ngOnInit(): void {
  }

}
