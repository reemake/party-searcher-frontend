import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {RegistrationService} from '../../services/registration.service'
import {User} from '../../entity/User';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user = new User();

  constructor(private _service: RegistrationService) { }

  ngOnInit(): void {
  }

  loginUser() {
    this._service.loginUserFromRemote(this.user).subscribe(
      data => console.log("response recieved"),
      error => console.log("exception occured")
    )
  }

}