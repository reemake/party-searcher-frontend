import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { User } from 'src/app/entity/User';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-commercial-register',
  templateUrl: './commercial-register.component.html',
  styleUrls: ['./commercial-register.component.css']
})
export class CommercialRegisterComponent implements OnInit {

  userLogin: string = localStorage.getItem("username") || '';
  user = new User();
  userEdited = new User();
  msg: string = '';

  constructor(private userService: UserService, private router: Router) { }

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
        this.msg = "error";
      }
    )
  }

  registerCommercialUser() {
    this.userEdited.login = this.user.login;
    if (this.userEdited.email == null)
      this.userEdited.email = this.user.email;
    if (this.userEdited.firstName == null)
      this.userEdited.firstName = this.user.firstName;
    if (this.userEdited.lastName == null)
      this.userEdited.lastName = this.user.lastName;
    if (this.userEdited.phone == null)
      this.userEdited.phone = this.user.phone;
    if (this.userEdited.pictureUrl == null)
      this.userEdited.pictureUrl = this.user.pictureUrl;
    if (this.userEdited.organizationName == null)
      this.userEdited.organizationName = this.user.organizationName;
    if (this.userEdited.description == null)
      this.userEdited.description = this.user.description;
    if (this.userEdited.commercialUser == null)
      this.userEdited.commercialUser = this.user.commercialUser;

    this.userEdited.commercialUserCreated = true;

    this.userService.updateCommercialAcc(this.userEdited).subscribe(
      result => {
        console.log("commercial account successfully registered");
        this.getUserInfo();
      },
      error => {
        console.log(error);
      }
    )
    this.router.navigate(["/profile/accounts"]);
  }

}
