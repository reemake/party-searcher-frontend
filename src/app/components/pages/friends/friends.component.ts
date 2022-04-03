import { Component, OnInit } from '@angular/core';
import {UserService} from './user.service'
import { User } from './user';
import {HttpClient} from "@angular/common/http";
import { BACKEND_URL } from 'src/app/app.module';
import { Relationship } from './Relationship';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {

  findCheck: boolean = false;
  users: User[];
  requests: Relationship[];
  requestsCheck: boolean = false;

  constructor(private userService: UserService, private httpClient: HttpClient) {
    this.userService.getRequests().subscribe((data: Relationship[]) => {
      this.requests = data;
      console.log("waiting requests");
      console.log(data);
      this.requestsCheck = true;
    });
    console.log(this.requests);
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
    var data = { "friendName": friendLogin};
    this.httpClient.post<any>(BACKEND_URL + "/api/requestFriend", null, {headers: data}).subscribe(e=> {
      console.log("sending data");
    });
  }

  clickRequestButton(event: any): void {
    var onwerLogin: string = (<HTMLInputElement>event.path[0]).id;
    if ((<HTMLInputElement>event.path[0]).textContent == "Принять заявку") {
      console.log("Принять заявку");
      var data = { 
        "friendName": onwerLogin,
        "friend": "1"
      };
      this.httpClient.post<any>(BACKEND_URL + "/api/requestFriend", null, {headers: data}).subscribe(e=> {
        console.log("sending data");
      });
    }
    if ((<HTMLInputElement>event.path[0]).textContent == "Отклонить заявку") {
      console.log("Отклонить заявку");
      var data1 = {
        "friendName": onwerLogin
      };
      this.httpClient.post<any>(BACKEND_URL + "/api/cancelFriend", null, {headers: data1}).subscribe(e=> {
        console.log("sending data");
      });
    }
  }

}
