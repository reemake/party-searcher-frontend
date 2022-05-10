import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Jwt} from "../../../entity/Jwt";
import {HttpClient} from "@angular/common/http";
import {BACKEND_URL} from "../../../app.module";

@Component({
  selector: 'app-oauth-login-dialog',
  templateUrl: './oauth-login-dialog.component.html',
  styleUrls: ['./oauth-login-dialog.component.css']
})
export class OauthLoginDialogComponent implements OnInit {
  public userLogin: string = "";
  public error = "";

  constructor(private httpClient: HttpClient,
              public dialogRef: MatDialogRef<OauthLoginDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Jwt) {

  }


  public completeRegister() {
    this.data.id.username = this.userLogin;
    this.httpClient.post<Jwt>(BACKEND_URL + "/completeOauth", this.data,{headers:{'isOauthRegister':'true'}}).subscribe((success: Jwt) => {
        localStorage.setItem("token", success.id.jwt);
        localStorage.setItem("refreshToken", success.refreshToken);
        localStorage.setItem("username", success.id.username || '');
        this.dialogRef.close();
      }, (error1 => {
        this.error = error1.error.message || "Произошла ошибка";
      })
    );
  }


  ngOnInit(): void {
  }

}
