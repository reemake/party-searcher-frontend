import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { AppModule } from 'src/app/app.module';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { InviteService } from './invite.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public invitesCheck: boolean = false;

  constructor(private _router: Router, public _authService: AuthenticationService, private inviteService: InviteService) {
    if (localStorage.getItem("token")) {
      if(inviteService.isInvated()) this.invitesCheck = true;
      else this.invitesCheck = false;
    }
  }

  ngOnInit(): void {
  }

}
