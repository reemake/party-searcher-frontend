import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {
  private button: any;
  private oldId: string;

  constructor() {
  }

  ngOnInit(): void {
  }

  requestChange(): void {
    console.log("requestChange");
    if (this.button != null) {
      console.log("old value: " + this.oldId);
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
