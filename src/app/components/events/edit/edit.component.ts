import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Event} from "../../../entity/Event/Event";
import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {debounceTime, Subject} from "rxjs";
import {EventService} from "../../../services/event.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Tag} from "../../../entity/Event/Tag";
import {Relationship} from "../../pages/friends/Relationship";
import {UserService} from "../../pages/friends/user.service";
import {User} from "../../../entity/User";
import {Location} from "../../../entity/Location";

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  public message: string = "";
  public location: string = "";
  public selectedEvents: Array<Event> = new Array<Event>();
  public events: Array<Event> = new Array<Event>();
  public event: Event | null = null;
  public tagsCount: number = 0;
  public formGroup: FormGroup;
  public nameInput: FormControl = new FormControl(null, [Validators.required]);
  public descriptionInput: FormControl = new FormControl();
  public startTimeInput: FormControl = new FormControl(null, [Validators.required]);
  public endTimeInput: FormControl = new FormControl();
  public maxGuestsCountInput: FormControl = new FormControl();
  public priceInput: FormControl = new FormControl();
  public isPrivateInput: FormControl = new FormControl();
  public isOnlineInput: FormControl = new FormControl(false);
  public locationInput: FormControl = new FormControl();
  public urlInput: FormControl;
  public eventThemeInput: FormControl = new FormControl(null, [Validators.required]);
  public eventTypeInput: FormControl = new FormControl(null, [Validators.required]);
  public hasChatWithOwnerInput: FormControl = new FormControl(false);
  public error: string = "";
  public currentLocation: number[] = [];
  public eventTypes: string[] = [];
  public changeBounds: Subject<any> = new Subject<any>();
  public locationChangeSubject: Subject<any> = new Subject<any>();
  public mapWidth = "100%";
  public tagsInputs: Array<FormControl> = new Array<FormControl>();
  private maxSW: number[] = [];
  private maxNE: number[] = [];
  private currentEvent: Event;
  public invateUser: FormControl = new FormControl();
  public friends: Relationship[];
  public friendsCheck: boolean = false;
  public invitedFriendsCheck: boolean = false;
  public invitedFriendsLogins: string[] = new Array;
  private eventLocation: Location;

  constructor(private eventService: EventService, private router: Router, private userService: UserService, private changeDetector: ChangeDetectorRef, private activatedRoute: ActivatedRoute) {
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
    this.activatedRoute.queryParams.subscribe(params => {
      this.eventService.get(params['id']).subscribe(event => {
        this.currentEvent = event;
        this.location = event.location?.name || '';
        this.invitedFriendsLogins = event.invitedGuests.map(e => e.login);
        this.descriptionInput.setValue(event.description);
        this.nameInput.setValue(event.name);
        this.isOnlineInput.setValue(event.isOnline);
        this.endTimeInput.setValue(event.dateTimeEnd);
        this.startTimeInput.setValue(event.dateTimeStart);
        this.eventThemeInput.setValue(event.theme);
        this.hasChatWithOwnerInput.setValue(event.hasChatWithOwner);
        this.eventTypeInput.setValue(event.eventType.name);
        this.maxGuestsCountInput.setValue(event.maxNumberOfGuests);
        this.priceInput.setValue(event.price);
        this.locationInput.setValue(event.location?.name);
        this.urlInput.setValue(event.url);
        event.tags.forEach(tag => {
          var tagControl = new FormControl();
          tagControl.setValue(tag.name);
          this.tagsInputs.push(tagControl);
        });
      }, error1 => this.message = error1);
    })

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
      url: new FormControl("", [this.urlValidator().bind(this.formGroup)]),
      theme: this.eventThemeInput,
      type: this.eventTypeInput
    });
    this.urlInput = this.formGroup.controls['url'] as FormControl;
    this.changeBounds.pipe(
      debounceTime(500)
    )
      .subscribe(event => {
        if (this.isSWandNEmore(event[2], event[3])) {
          this.eventService.getEventsWithinRadius(event[0], event[1])
            .subscribe((events: Event[]) => {
              this.events = events;
              this.currentLocation = event[0];
            });
        }
      })
    this.locationChangeSubject.pipe(debounceTime(2000))
      .subscribe(location => {
        var eventData: any = {
          location: {
            location: {
              coordinates: location
            }
          }
        };
        if (this.eventLocation) {
          this.eventLocation.location.coordinates = eventData.location.location.coordinates;
          this.eventLocation.name = '';
        } else {
          this.eventLocation = {
            location: {type: "Point", coordinates: eventData.location.location.coordinates},
            name: this.location
          }
        }
        this.eventService.setAddressByLonLat(eventData, () => {
          this.location = eventData.location.name;
          this.eventLocation.name = eventData.location.name;
        })

      })

    this.isOnlineInput.valueChanges.subscribe((val) => {
      this.urlInput.updateValueAndValidity();
    })
  }


  ngOnInit(): void {
    this.eventService.getTypes().subscribe(types => {
        this.eventTypes = types.map(event => event.name);
      }, error1 => {
        alert("При загрузке типов мероприятий произошла ошибка, повторите еще раз")
      }
    );
  }

  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
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
    } catch (e) {
      console.log("error: " + e);
    }
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
      id: this.currentEvent.id,
      description: this.descriptionInput.value,
      theme: this.eventThemeInput.value,
      name: this.nameInput.value,
      eventType: {name: this.eventTypeInput.value},
      isOnline: this.isOnlineInput.value,
      isPrivate: this.isPrivateInput.value,
      url: this.isOnlineInput.value ? this.urlInput.value : null,
      dateTimeStart: this.startTimeInput.value,
      dateTimeEnd: this.endTimeInput.value,
      invitedGuests: tempArray,
      maxNumberOfGuests: this.maxGuestsCountInput.value,
      price: this.priceInput.value,
      tags: [],
      guests: [],
      hasChatWithOwner: !this.hasChatWithOwnerInput.value
    };
    this.tagsInputs.forEach(val => {
      let tag: Tag = {name: String(val.value).toUpperCase()};
      event.tags.push(tag);
    });
    if (!event.isOnline) {
      event.url = undefined;
      if (this.eventLocation && event.location?.location.coordinates !== this.eventLocation.location.coordinates) {
        event.location = this.eventLocation;
      } else event.location = this.currentEvent.location;
    }
    this.update(event);
  }

  private update(event: Event) {
    this.eventService.editEvent(event).subscribe(event => {
      alert("Событие успешно обновлено");
      this.router.navigateByUrl("/events/map")
    }, error => {
      this.error = error;
    });
  }

  remove(control: FormControl): void {
    this.tagsInputs = this.tagsInputs.filter(tag => tag !== control);
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


}
