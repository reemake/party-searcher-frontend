import {Component} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BACKEND_URL} from 'src/app/app.module';
import {AuthenticationService} from "../../../services/auth/authentication.service";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'survey-component',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css']
})
export class SurveyComponent {
  surveyButton: boolean = false;

  constructor(private http: HttpClient, private authService: AuthenticationService,private cookie:CookieService) {
    if (this.cookie.get("surveyCancel"))
    this.authService.checkAuth().subscribe(e => {
      this.http.get<boolean>(BACKEND_URL + "/api/surveyCheck")
        .subscribe((checkResult: boolean) => {
          this.surveyButton = !checkResult;
        });
    }, error => console.log("not auth"));
  }

  public surveyButtonPress(): void {
    this.surveyButton = !this.surveyButton;
  }

  cancelButtonPress() {
    var date=new Date();
    date.setHours(date.getHours()+24);
    this.cookie.set("surveyCancel","yes",date)
  this.surveyButton=false;
  }
}
