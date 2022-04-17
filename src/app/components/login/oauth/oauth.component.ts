import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {BACKEND_URL} from "../../../app.module";
import {Jwt} from "../../../entity/Jwt";

@Component({
  selector: 'app-oauth',
  templateUrl: './oauth.component.html',
  styleUrls: ['./oauth.component.css']
})
export class OauthComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private httpService: HttpClient, private router: Router) {
  }

  ngOnInit(): void {

    this.activatedRoute.queryParams.subscribe(e => {
      var token = e["token"];
      localStorage.setItem("token", token);
      var jwt: Jwt = {
        id: {
          username: '',
          jwt: token
        },
        refreshToken: ''
      }
      this.httpService.post<Jwt>(BACKEND_URL + "/api/generateRefreshToken", {}, {params: {Authorization: token}}).subscribe(refreshToken => {
        console.log(refreshToken)
        localStorage.setItem("refreshToken", refreshToken.refreshToken);
        localStorage.setItem("username", refreshToken.id.username || '');
        this.router.navigateByUrl("/");
      })
      /*        if (this.activatedRoute.url)
                this.httpService.get(`${BACKEND_URL}/login/oauth2/code/google`,{params:{
                  code:e['code'],
                    state:e['state'],
                    registrationId:authService
                  }}).subscribe(token=>{
                  console.log(token);
                },error => console.log(error))*/
    })

  }

}
