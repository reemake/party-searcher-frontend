import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AppModule, BACKEND_URL } from 'src/app/app.module';
import { User } from 'src/app/entity/User';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {

  hasAuth = AppModule.HAS_AUTH;
  userLogin: string = localStorage.getItem("username") || '';

  user = new User();

  constructor(private userService: UserService) {
    
   }

  ngOnInit(): void {
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

}
