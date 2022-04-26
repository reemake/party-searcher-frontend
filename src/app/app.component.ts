import {Component} from '@angular/core';
import {EventService} from "./services/event.service";
import {AuthenticationService} from "./services/auth/authentication.service";
import {CookieService} from "ngx-cookie-service";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ReviewDialogComponent} from "./components/review-dialog/review-dialog.component";
import {Review} from "./entity/Event/Review";
import {ReviewService} from "./services/review.service";
import {Event} from "./entity/Event/Event";
import {SuccessDialogComponent} from "./components/success-dialog/success-dialog.component";
import {NoopScrollStrategy} from "@angular/cdk/overlay";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'eventTeammatesSearchApp';
  private eventIndex = 0;
  private matDialogRef: MatDialogRef<ReviewDialogComponent> | undefined;
  private events: Event[] = [];

  constructor(private matDialog: MatDialog, private eventService: EventService, private authService: AuthenticationService,
              private cookieService: CookieService, private reviewService: ReviewService) {
    if (!cookieService.check("reviewsLoaded")) {
      this.setCookie();
      this.eventService.getEndedEvents().subscribe(e => {
        this.events = e;
        if (e.length > 0) {
          this.matDialogRef = matDialog.open(ReviewDialogComponent, {
            width: '250px',
            data: e[this.eventIndex],
            scrollStrategy: new NoopScrollStrategy()
          });
          this.matDialogRef.afterClosed().subscribe((review: Review) => {
            this.reviewService.add(review).subscribe((e) => {
                  if (!review.notReady)
                    this.matDialog.open(SuccessDialogComponent, {data: "Благодарим за оставленный отзыв"});
                }, error => alert("Произошла ошибка при добавлении отзыва"));

              this.eventIndex++;
            if (this.events[this.eventIndex] && !review.notReady)
              this.matDialogRef = this.matDialog.open(ReviewDialogComponent, {
                width: '250px',
                data: this.events[this.eventIndex],
                scrollStrategy: new NoopScrollStrategy()
              });
          })
        }
      })
    }


  }

  setCookie() {
    var date = new Date();
    date.setDate(Date.now());
    date.setMilliseconds(date.getMilliseconds() + 8.64e7);
    this.cookieService.set("reviewsLoaded", Date(), {expires: date});
  }

}


