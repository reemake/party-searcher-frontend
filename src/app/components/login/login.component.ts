import {Component, OnInit} from '@angular/core';
import {RegistrationService} from '../../services/auth/registration.service'
import {User} from '../../entity/User';
import {Router} from '@angular/router';
import {HttpResponse} from "@angular/common/http";
import { AppModule } from 'src/app/app.module';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user = new User();
  msg = '';

  constructor(private _service: RegistrationService, private _router: Router) { }

  ngOnInit(): void {
  }

  loginUser() {
    this._service.loginUserFromRemote(this.user).subscribe(
      (resp: HttpResponse<any>) => {
        var headers = resp.headers;
        if (headers.get("token") !== null && headers.get("refreshToken") !== null) {
          localStorage.setItem("token", <string>headers.get("token"));
          localStorage.setItem("refreshToken", <string>headers.get("refreshToken"));
        }
        console.log("response recieved");
        AppModule.HAS_AUTH = true;
        this._router.navigate(['/'])
      },
      error => {
        console.log("exception occured");
        AppModule.HAS_AUTH = false;
        this.msg = "Неправильный логин или пароль";
      }
    )
  }

}
