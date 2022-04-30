import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import {map, Observable} from 'rxjs';
import {AuthenticationService} from "./authentication.service";
import {Role} from "../../entity/Role";

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authService:AuthenticationService) {
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.getUserData().pipe(map(val=>{
      if (val.authorities && val.authorities?.filter(e=>e===Role.ADMIN).length>0){
        return true;
      }
      else return false;
    }))
  }

}
