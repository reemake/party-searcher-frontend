import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {User} from 'src/app/entity/User';
import {UserService} from 'src/app/services/user.service';
import {MatDialog} from "@angular/material/dialog";
import {SuccessDialogComponent} from "../../success-dialog/success-dialog.component";
import {CommercialServiceService} from "../../../services/commercial-service.service";

@Component({
  selector: 'app-commercial-register',
  templateUrl: './commercial-register.component.html',
  styleUrls: ['./commercial-register.component.css']
})
export class CommercialRegisterComponent implements OnInit {
  public hasExistingRegistration = false;

  userLogin: string = localStorage.getItem("username") || '';
  user = new User();
  userEdited = new User();
  msg: string = '';

  constructor(private userService: UserService, private router: Router, private matDialog: MatDialog, private commercialService: CommercialServiceService) {
  }

  ngOnInit(): void {
    this.getUserInfo();
    this.commercialService.getInfoAboutCommercialUser().subscribe(e => {
      if (e) {
        this.hasExistingRegistration = true;
        this.user.description = e.description;
        this.user.organizationName = e.organizationName;
      }
    });
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

  public payForExistRegistration() {
    this.commercialService.getUrlForPaying().subscribe(url => {
      if (url) {
        location.href = url;
      } else {

      }
    }, error => console.log("Произошла ошибка"))
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

    this.userService.registerCommercialAcc(this.userEdited).subscribe(
      result => {
        this.matDialog.open(SuccessDialogComponent, {data: "Сейчас вы перейдете на форму оплаты, после оплаты коммерческий аккаунт будет активирован автоматически в течении 5 минут после оплаты"})
        setTimeout(() => location.href = result.url, 6000);
      },
      error => {
        this.msg = error.error.message;
      }
    )

  }

}
