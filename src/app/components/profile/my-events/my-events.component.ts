import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/entity/User';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.css']
})
export class MyEventsComponent implements OnInit {

  userLogin: string = localStorage.getItem("username") || '';
  user = new User();
  userEdited = new User();

  events =["Event1", "Event2", "Event3", "Event4", "Event2", "Event2", "Event2", "Event2", "Event2"];

  constructor(private userService: UserService, public authService: AuthenticationService, private router: Router) {
    
   }

   ngOnInit(): void {
    this.getUserInfo();
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

}
