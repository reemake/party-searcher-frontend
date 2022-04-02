import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from 'src/app/entity/User';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit {

  userLogin: string = localStorage.getItem("username") || '';

  user = new User();
  userEdited = new User();
  msg = '';

  constructor(private userService: UserService, public authService: AuthenticationService) {
    
   }

  ngOnInit(): void {
    this.getUserInfo();
  }

  updateUser(dataChangeForm: NgForm) {

    this.userEdited.login = this.user.login;
    if (this.userEdited.email == null)
      this.userEdited.email = this.user.email;
    if (this.userEdited.password == null)
      this.userEdited.password = this.user.password;
    if (this.userEdited.firstName == null)
      this.userEdited.firstName = this.user.firstName;
    if (this.userEdited.lastName == null)
      this.userEdited.lastName = this.user.lastName;
    if (this.userEdited.phone == null)
      this.userEdited.phone = this.user.phone;

    console.log(this.userEdited);
    this.userService.updateUser(this.userEdited).subscribe(
      result => {
          console.log("user successfully updated");
          dataChangeForm.reset();
          this.getUserInfo();
      },
      error => {
          console.log(error);
      }
    )
  }

  getUserInfo() {
    this.userService.getUser(this.userLogin).subscribe(
      result => {
        this.user = result;
        console.log(this.user);
        console.log(this.authService.isAuth());
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
