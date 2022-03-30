import { Component, OnInit } from '@angular/core';
import {UserService} from './user.service'
import { User } from './user';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {
  private button: any;
  private oldId: string;

  users: User[];
  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
  }

  requestChange(): void {
    if (this.button != null) {
      var field = document.getElementById("searchField");
      // console.log("field value: " + (<HTMLInputElement>field).value);
      this.userService.getUsers((<HTMLInputElement>field).value).subscribe((data: User[]) => {
        console.log(data);
      })
    }
  }

  buttonClick(id: string): void {
    if (this.button != null) {
      (<HTMLInputElement>this.button).id = this.oldId;
      this.button = <HTMLInputElement>document.getElementById(id);
      this.oldId = this.button.id;
      (<HTMLInputElement>this.button).id = "clickedButton";
    } else {
      this.button = <HTMLInputElement>document.getElementById(id);
      this.oldId = this.button.id;
      (<HTMLInputElement>this.button).id = "clickedButton";
    }
  }

}
