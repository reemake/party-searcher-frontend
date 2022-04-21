import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {Event} from "../../../entity/Event/Event";
import {EventService} from "../../../services/event.service";
import {Tag} from "../../../entity/Event/Tag";
import {debounceTime, Subject} from "rxjs";
import {Router} from "@angular/router";

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
  private maxSW: number[] = [];
  private maxNE: number[] = [];

  public locationChangeSubject: Subject<any> = new Subject<any>();


  public mapWidth = "100%";
  public tagsInputs: Array<FormControl> = new Array<FormControl>();


  constructor(private eventService: EventService, private router: Router, private changeDetector: ChangeDetectorRef) {
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
    console.log("ADD TAG")
    let tag: FormControl = new FormControl("", [Validators.required]);
    this.tagsInputs.push(tag);
    this.formGroup.addControl(String("tag" + this.tagsInputs.length), tag, {emitEvent: false});
  }

  submit(): void {
    console.log("SUBMIT")
    if (!this.formGroup.valid) {
      this.formGroup.markAllAsTouched();
      this.error = "Заполните все обязательные поля!";
      return
    } else {
      this.error = "";
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
        hasChatWithOwner: !this.hasChatWithOwnerInput.value
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

  remove(control: FormControl): void {
    this.tagsInputs = this.tagsInputs.filter(tag => tag !== control);
    this.formGroup.removeControl(control.value);
  }



}
