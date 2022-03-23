import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { AppModule } from 'src/app/app.module';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  hasAuth = AppModule.HAS_AUTH;

  constructor(private _router: Router) {
    
  }

  ngOnInit(): void {
    console.log(this.hasAuth);
  }

}
