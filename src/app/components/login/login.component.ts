import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {RegistrationService} from '../../services/registration.service'
import {User} from '../../entity/User';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user = new User();
  msg='';

  constructor(private _service: RegistrationService, private _router: Router) { }

  ngOnInit(): void {
  }

  loginUser() {
    this._service.loginUserFromRemote(this.user).subscribe(
      data => {
        console.log("response recieved");
        this._router.navigate(['/'])
      },
      error => {
        console.log("exception occured");
        this.msg="Неправильный логин или пароль";
      }
      )
  }

}
