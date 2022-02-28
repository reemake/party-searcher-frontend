import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {User} from '../entity/User';
import {RegistrationService} from '../registration.service'

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  user = new User();

  constructor(private _service: RegistrationService) { }

  ngOnInit(): void {
  }

  registerUser() {
    this._service.registerUserFromRemote(this.user).subscribe(
      data => console.log("response recieved"),
      error => console.log("exception occured")
    )
  }

}
