import {Component, OnInit} from '@angular/core';
import {UserService} from "../../../services/user.service";
import {User} from "../../../entity/User";
import {Role} from "../../../entity/Role";

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {

  public users: User[] = [];
  public rolesMap = new Map<string, Role>();
  public selectItems: any[] = [];
  private loadedUsers: User[] = [];

  constructor(private userService: UserService) {
    var username = localStorage.getItem("username");
    this.userService.getUsers().subscribe(users => {
      this.users = users.filter(e => e.login !== username);
      this.loadedUsers = JSON.parse(JSON.stringify(this.users));
    })

    this.rolesMap = this.rolesMap.set("Пользователь", Role.USER);
    this.rolesMap = this.rolesMap.set("Администратор", Role.ADMIN);
    this.rolesMap = this.rolesMap.set("Модератор жалоб", Role.ComplaintResolver);
    for (let str of this.rolesMap.keys()) {
      this.selectItems.push({'label': str, "value": this.rolesMap.get(str)})
    }
  }

  ngOnInit(): void {
  }
  updatePrivelleges(user: User) {
   this.userService.updateUserAuthority(user).subscribe(e=>alert("Привелегии пользователя успешно обновлены"),
      error => alert("Не удалось обновить привелегии пользователя, ошибка "+JSON.stringify(error)));;
  }

  updatePrivellegesOfAll() {
    var changed: User[] = [];
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].authorities !== this.loadedUsers[i].authorities) {
        changed.push(this.users[i]);
      }
    }
    this.userService.updateUsersAuthorities(changed).subscribe(e=>alert("Привелегии пользователей успешно обновлены"),
        error => alert("Не удалось обновить привелегии пользователей, ошибка "+JSON.stringify(error)));
  }

  logging(event: any) {
    console.log(event);
  }

  deletePhoto(user: User) {
    this.userService.deleteUserPhoto(user).subscribe(e => {

    }, error => alert("ошибка при удалении фотографии плользователя"));
  }


}
