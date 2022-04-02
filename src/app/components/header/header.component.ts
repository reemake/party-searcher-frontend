import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { AppModule } from 'src/app/app.module';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private _router: Router, public _authService: AuthenticationService) {
    
  }

  ngOnInit(): void {
  }

}
