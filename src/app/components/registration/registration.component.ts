import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {User} from '../../entity/User';
import {RegistrationService} from '../../services/auth/registration.service'

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  user = new User();
  msg='';

  constructor(private _service: RegistrationService, private _router: Router) { }

  ngOnInit(): void {
  }

  registerUser() {
    this._service.registerUserFromRemote(this.user).subscribe(
      data => {
        console.log("response recieved");
        this.msg="Регистрация прошла успешно!";
        this._router.navigate(['login']);
      },
      error => {
        console.log("exception occured");
        console.log(error);
        this.msg="Пользователь с данным логином уже существует!";
      }
    )
  }

}
