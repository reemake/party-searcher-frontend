import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  hasAuth: boolean;

  constructor(private _router: Router) {
    if (globalThis.HAS_AUTH)
      this.hasAuth = true;
    else
      this.hasAuth = false;
    console.log("hasAuth = " + this.hasAuth);
  }

  ngOnInit(): void {
    
  }

}
