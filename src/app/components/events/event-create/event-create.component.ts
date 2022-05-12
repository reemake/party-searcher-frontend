import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {Event} from "../../../entity/Event/Event";
import {EventService} from "../../../services/event.service";
import {debounceTime, Subject} from "rxjs";
import {Relationship} from '../../profile/friends/Relationship';
import {User} from 'src/app/entity/User';
import {Router} from "@angular/router";
import {UserService} from "../../profile/friends/user.service";
import {UserService as ArtyomUserService} from "../../../services/user.service" ;


@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.css']
})
export class EventCreateComponent implements OnInit {
  public message: string = "";
  public location: string = "";
  public selectedEvents: Array<Event> = new Array<Event>();
  public events: Array<Event> = new Array<Event>();
  public event: Event | null = null;
  private currentDistance = 0;
  public tagsCount: number = 0;
  public formGroup: FormGroup;
  public nameInput: FormControl = new FormControl(null, [Validators.required]);
  public descriptionInput: FormControl = new FormControl();
  public startTimeInput: FormControl = new FormControl('', [Validators.required]);
  public endTimeInput: FormControl = new FormControl();
  public maxGuestsCountInput: FormControl = new FormControl();
  public priceInput: FormControl = new FormControl();
  public isPrivateInput: FormControl = new FormControl();
  public isOnlineInput: FormControl = new FormControl(false);
  public locationInput: FormControl = new FormControl();
  public invateUser: FormControl = new FormControl();
  public urlInput: FormControl = new FormControl(null, [this.urlValidator()]);
  public eventThemeInput: FormControl = new FormControl(null, [Validators.required]);
  public eventTypeInput: FormControl = new FormControl(null, [Validators.required]);
  public error: string = "";
  public currentLocation: number[] = [];
  public eventTypes: string[] = [];
  public changeBounds: Subject<any> = new Subject<any>();
  private maxSW: number[] = [];
  private maxNE: number[] = [];
  public hasChatWithOwnerInput: FormControl = new FormControl(false);

  public locationChangeSubject: Subject<any> = new Subject<any>();
  public friends: Relationship[];
  public friendsCheck: boolean = false;
  public invitedFriendsCheck: boolean = false;
  public invitedFriendsLogins: string[] = new Array;
  public usersByMail: User[];
  public usersByMailCheck: boolean = false;
  public currentUser:User;


  public mapWidth = "100%";
  public tagsInputs: Array<FormControl> = new Array<FormControl>();



  constructor(private eventService: EventService, private userService: UserService, private router: Router,private userServiceArt:ArtyomUserService) {
    this.userServiceArt.getUser(localStorage.getItem("username")||'')
      .subscribe(user=>this.currentUser=user);
    this.userService.getFriends().subscribe((data: Relationship[]) => {
        console.log("waiting friends");
        this.friends = data;
        for (let i = 0; i < this.friends.length; i++) {
          if (this.friends[i].id.friend.pictureUrl == null) {
            this.friends[i].id.friend.pictureUrl = "./../../../../assets/img/profile/accImgExample.png";
          }
          if (this.friends[i].id.owner.pictureUrl == null) {
            this.friends[i].id.owner.pictureUrl = "./../../../../assets/img/profile/accImgExample.png";
          }
      }
      if (this.friends.length > 0) this.friendsCheck = true;
    }
    );
    this.locationInput.disable();
    this.formGroup = new FormGroup({
      name: this.nameInput,
      description: this.descriptionInput,
      startTime: this.startTimeInput,
      endTime: new FormControl('',[this.endDateValidator().bind(this.formGroup)]),
      maxGuests: this.maxGuestsCountInput,
      price: this.priceInput,
      isPrivate: this.isPrivateInput,
      isOnline: this.isOnlineInput,
      location: this.locationInput,
      url: new FormControl("", [this.urlValidator().bind(this.formGroup)]),
      theme: this.eventThemeInput,
      type: this.eventTypeInput
    });
    this.endTimeInput=this.formGroup.controls['endTime'] as FormControl;
    this.urlInput = this.formGroup.controls['url'] as FormControl;
    this.changeBounds.pipe(
      debounceTime(500)
    )
      .subscribe(event => {
        if (this.isSWandNEmore(event[2], event[3])) {
          this.eventService.getEventsWithinRadius(event[0], event[1])
            .subscribe((events: Event[]) => {
              console.log("down")
              this.events = events;
              this.currentLocation = event[0];
            });
        }
      });
    this.locationChangeSubject.pipe(debounceTime(2000))
      .subscribe(location => {
        this.currentLocation = location;
        var eventData: any = {
          location: {
            location: {
              coordinates: location
            }
          }
        };
        this.eventService.setAddressByLonLat(eventData, () => {
          this.location = eventData.location.name;
        })
      })

    this.isOnlineInput.valueChanges.subscribe((val) => {
      this.urlInput.updateValueAndValidity();
    })

    this.startTimeInput.valueChanges.subscribe((value => {
      this.endTimeInput.updateValueAndValidity();
    }))
  }
  ngOnInit(): void {
    this.eventService.getTypes().subscribe(types => {
        this.eventTypes = types.map(event => event.name);
      }, error1 => {
        alert("При загрузке типов мероприятий произошла ошибка, повторите еще раз")
      }
    );
  }

  endDateValidator():ValidatorFn{
    return (control: AbstractControl): ValidationErrors | null => {
      console.log(control.value)
      console.log(control.parent?.get('startTime')?.value);
      if (control.value!=='' && control.parent?.get('startTime')?.value===''){
        console.log("no begin")
        return {"no begin date":true};
      }
      if (control.parent?.get('startTime')?.value > control.value && control.value) {
        console.log("less begin")
        return {"end date less begin":true};
      }

      return null;
    }
  }


  urlValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      console.log(this.isOnlineInput.value)
      console.log(control.value === null)
      console.log(control.value == "")
      if (control.parent?.get('isOnline')?.value === true && (control.value === null || control.value == "")) {
        return ["url empty error"];
      }

      return null;
    }
  }

  closeEvent(): void {
    this.event = null;
    this.mapWidth = "100%";
  }

  private isSWandNEmore(SW: number[], NE: number[]): boolean {
    if (this.maxNE.length == 0 || this.maxSW.length == 0) {
      this.maxNE = NE;
      this.maxSW = SW;
      return true;
    } else {
      if (SW[0] < this.maxSW[0] || SW[1] < this.maxSW[0] || NE[0] > this.maxNE[0] || NE[1] > this.maxNE[1]) {
        this.maxNE = NE;
        this.maxSW = SW;
        return true;

      } else return false;
    }
  }

  selectEvents(event: any): void {
    if (event.length > 1) {
      this.selectedEvents = event;
    } else if (event.length == 1) {
      this.mapWidth = "80%"
      this.event = event[0];
    }
  }



  addTag(): void {
    let tag: FormControl = new FormControl("", Validators.required);
    this.tagsInputs.push(tag);
    this.formGroup.addControl(String("tag" + this.tagsInputs.length), tag, {emitEvent: false});
  }


  remove(control: FormControl): void {
    this.formGroup.removeControl("tag" + this.tagsInputs.length, {emitEvent: false});
    this.tagsInputs = this.tagsInputs.filter(tag => tag !== control);

  }

  submit(): void {
    console.log("SUBMIT")
    if (!this.formGroup.valid) {
      this.formGroup.markAllAsTouched();
      this.error = "Заполните все обязательные поля!";
      return
    } else {
      var tempArrayLogin: string[];
      tempArrayLogin = this.invitedFriendsLogins;
      for (let i = 0; i < tempArrayLogin.length; i++) tempArrayLogin[i] = tempArrayLogin[i].split(" (")[0];
      var tempUser: User;
      var tempArray: User[] = new Array();
      for (let i = 0; i < tempArrayLogin.length; i++) {
        tempUser = new User;
        tempUser.login = tempArrayLogin[i];
        tempArray.push(tempUser);
      }
      this.error = "";
      let event: Event = {
        description: this.descriptionInput.value,
        theme: this.eventThemeInput.value,
        name: this.nameInput.value,
        eventType: {name: this.eventTypeInput.value},
        isOnline: this.isOnlineInput.value,
        isPrivate: this.isPrivateInput.value,
        invitedGuests: tempArray,
        url: this.isOnlineInput.value ? this.urlInput.value : null,
        dateTimeStart: this.startTimeInput.value,
        dateTimeEnd: this.endTimeInput.value,
        maxNumberOfGuests: this.maxGuestsCountInput.value,
        price: this.priceInput.value,
        tags: [],
        guests: [],
        hasChatWithOwner: !this.hasChatWithOwnerInput.value
      };
      this.tagsInputs.forEach(val => {
        let tag=String(val.value).toUpperCase();
        event.tags.push(tag);
      });
      if (!event.isOnline) {
        event.location = {
          name: "",
          location: {
            type: "Point",
            coordinates: this.currentLocation
          }
        };
        this.eventService.setAddressByLonLat(event, () => {
          this.eventService.add(event).subscribe(event => {
            alert("Событие успешно создано");
            this.router.navigateByUrl("/events/map")
          }, error => {
            alert("При создании эвента произошла ошибка, повторите еще раз");
            this.error = error;
          });
        });
      } else

        this.eventService.add(event).subscribe(event => {
          alert("Событие успешно создано");
          this.router.navigateByUrl("/events/map")
        }, error => {
          this.error = error;
        });
    }
  }
  public friendInvate(): void {
    try {
      for (var i = 0; i < this.invitedFriendsLogins.length; i++) {
        if (this.invitedFriendsLogins[i] == this.invateUser.value) {
          alert("Данный пользователь уже приглашен!");
          return;
        }
      }
      if (this.invateUser.value != "Пригласить пользователя") {
        this.invitedFriendsCheck = false;
        var tempLogin: string = this.invateUser.value;
        this.invitedFriendsLogins.push(tempLogin);
        this.invitedFriendsCheck = true;
      }
    } catch(e) { console.log("error: " + e); }
  }

  public removeInvate(event: any): void {
    for (var i = 0; i < this.invitedFriendsLogins.length; i++) {
      if (this.invitedFriendsLogins[i] == event.path[0].id) {
        if (this.invitedFriendsLogins.length > 1) {
          this.invitedFriendsCheck = false;
          var tempArray: string[] = new Array();
          for (var j = 0; j < i; j++) tempArray.push(this.invitedFriendsLogins[j]);
          if (i + 1 < this.invitedFriendsLogins.length) {
            for (j = i + 1; j < this.invitedFriendsLogins.length; j++) tempArray.push(this.invitedFriendsLogins[j]);
          }
          this.invitedFriendsLogins = tempArray;
          this.invitedFriendsCheck = true;
          return;
        } else {
          this.invitedFriendsCheck = false;
          this.invitedFriendsLogins = [];
          return;
        }
      }
    }
  }

  public emailInvate() {
    var mail = (<HTMLInputElement>document.getElementById("mailInput")).value;
    this.userService.getUsersByEmail(mail).subscribe((data) => {
      this.usersByMailCheck = false;
      this.usersByMail = data;
      if (this.usersByMail.length != 0) this.usersByMailCheck = true;
    });
  }

  public inviteUserByMail(user: User) {
    for (var i = 0; i < this.invitedFriendsLogins.length; i++) {
      if (this.invitedFriendsLogins[i] == (user.login + " (" + user.firstName + " " + user.lastName + ")")) {
        alert("Данный пользователь уже приглашен!");
        return;
      }
    }
    if (user.pictureUrl == null) {
      user.pictureUrl = "./../../../../assets/img/profile/accImgExample.png";
    }
    if (user.pictureUrl == null) {
      user.pictureUrl = "./../../../../assets/img/profile/accImgExample.png";
    }
    this.invitedFriendsCheck = false;
    this.invitedFriendsLogins.push((user.login + " (" + user.firstName + " " + user.lastName + ")"));
    this.invitedFriendsCheck = true;
  }
}
