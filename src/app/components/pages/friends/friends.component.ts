import { Component, OnInit } from '@angular/core';
import {UserService} from './user.service'
import { User } from './user';
import {HttpClient} from "@angular/common/http";
import { BACKEND_URL } from 'src/app/app.module';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {

  findCheck: boolean = false;
  users: User[];
  constructor(private userService: UserService, private httpClient: HttpClient) {
  }

  ngOnInit(): void {
  }

  requestChange(): void {
    this.findCheck = false;
    var field = document.getElementById("searchField");
    if ((<HTMLInputElement>field).value != "") {
      this.hideFields();
      this.userService.getUsers((<HTMLInputElement>field).value).subscribe((data: User[]) => {
        this.users = data;
        console.log(this.users);
        this.findCheck = true;
      })
    } else {
      this.findCheck = false;
      this.enableFields();
    }
  }

  hideFields(): void {
    var headers = document.getElementsByClassName("listSelector");
    for (let i = 0; i < headers.length; i++) {
      if ((<HTMLInputElement>headers[i]).id != "find") {
        (<HTMLInputElement>headers[i]).hidden = true;
      }
    }
  }

  enableFields(): void {
    var headers = document.getElementsByClassName("listSelector");
    for (let i = 0; i < headers.length; i++) {
      if ((<HTMLInputElement>headers[i]).id != "find") {
        (<HTMLInputElement>headers[i]).hidden = false;
      }
    }
  }

  clickFriendButton(event: any): void {
    var friendLogin: string = (<HTMLInputElement>event.path[0]).id;
    console.log(friendLogin);
    var data = { "friendName": friendLogin};
    console.log("sending data");
    console.log(data);
    this.httpClient.post<any>(BACKEND_URL + "/api/requestFriend", null, {headers: data}).subscribe(e=> {});
  }

}
