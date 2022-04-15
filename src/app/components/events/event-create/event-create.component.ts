import {Component, OnInit} from '@angular/core';
import {AbstractControl, Form, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {Event} from "../../../entity/Event/Event";
import {EventService} from "../../../services/event.service";
import {Tag} from "../../../entity/Event/Tag";
import {debounceTime, Subject} from "rxjs";
import { Relationship } from '../../pages/friends/Relationship';
import {UserService} from '../../pages/friends/user.service';
import { User } from 'src/app/entity/User';
import {EventAttendance} from "../../../entity/Event/EventAttendance";

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.css']
})
export class EventCreateComponent implements OnInit {
  public message: string = "";
  public selectedEvents: Array<Event> = new Array<Event>();
  public events: Array<Event> = new Array<Event>();
  public event: Event | null = null;
  private currentDistance = 0;
  public tagsCount: number = 0;
  public formGroup: FormGroup;
  public nameInput: FormControl = new FormControl(null, [Validators.required]);
  public descriptionInput: FormControl = new FormControl();
  public startTimeInput: FormControl = new FormControl(null, [Validators.required]);
  public endTimeInput: FormControl = new FormControl();
  public maxGuestsCountInput: FormControl = new FormControl();
  public priceInput: FormControl = new FormControl();
  public isPrivateInput: FormControl = new FormControl();
  public isOnlineInput: FormControl = new FormControl();
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

  public friends: Relationship[];
  public friendsCheck: boolean = false;
  public invitedFriendsCheck: boolean = false;
  public invitedFriendsLogins: string[] = new Array;

  public mapWidth = "100%";
  public tagsInputs: Array<FormControl> = new Array<FormControl>();

  constructor(private eventService: EventService, private userService: UserService) {
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
      endTime: this.endTimeInput,
      maxGuests: this.maxGuestsCountInput,
      price: this.priceInput,
      isPrivate: this.isPrivateInput,
      isOnline: this.isOnlineInput,
      location: this.locationInput,
      url: this.urlInput,
      theme: this.eventThemeInput,
      type: this.eventTypeInput
    });
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
      })
  }

  urlValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (this.isOnlineInput.value && (control.value === null || control.value == "")) {
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
    let tag: FormControl = new FormControl();
    this.tagsInputs.push(tag);
    this.formGroup.addControl(String("tag" + this.tagsInputs.length), tag);
  }

  submit(): void {
    if (!this.formGroup.valid) {
      this.formGroup.markAllAsTouched();
      this.error = "Заполните все обязательные поля!";
      return
    }
    this.error = "";
    


    for (let i = 0; i < this.invitedFriendsLogins.length; i++) this.invitedFriendsLogins[i] = this.invitedFriendsLogins[i].split(" (")[0];
    var tempUser: User;
    var tempArray: User[] = new Array();
    for (let i = 0; i < this.invitedFriendsLogins.length; i++) {
      tempUser = new User;
      tempUser.login = this.invitedFriendsLogins[i];
      tempArray.push(tempUser);
    }


    let event: Event = {
      description: this.descriptionInput.value,
      theme: this.eventThemeInput.value,
      name: this.nameInput.value,
      eventType: {name: this.eventTypeInput.value},
      isOnline: this.isOnlineInput.value,
      isPrivate: this.isPrivateInput.value,
      url: this.isOnlineInput.value ? this.urlInput.value : null,
      dateTimeStart: this.startTimeInput.value,
      dateTimeEnd: this.endTimeInput.value,
      maxNumberOfGuests: this.maxGuestsCountInput.value,
      price: this.priceInput.value,
      tags: [],
      guests: [],
      invitedGuests: tempArray
    };
    this.tagsInputs.forEach(val => {
      let tag: Tag = {name: String(val.value).toUpperCase()};
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
      console.log("first \n" + event);
      this.eventService.setAddressByLonLat(event, () => {
        console.log(event);
        this.eventService.add(event).subscribe(event => {

        }, error => {
          alert("При создании эвента произошла ошибка, повторите еще раз");
          this.error = error;
        });
      });
    } else

      this.eventService.add(event).subscribe(event => {
        this.message = "Событие успешно создано"
      }, error => {
        this.error = error;
      });
  }

  remove(control: FormControl): void {
    this.tagsInputs = this.tagsInputs.filter(tag => tag !== control);
  }


  ngOnInit(): void {
    this.eventService.getTypes().subscribe(types => {
        this.eventTypes = types.map(event => event.name);
      }, error1 => {
        console.log("GIVE ERROR");
        alert("При загрузке типов мероприятий произошла ошибка, повторите еще раз")
      }
    );
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

}
