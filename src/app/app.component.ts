import {Component} from '@angular/core';
import {EventService} from "./services/event.service";
import {AuthenticationService} from "./services/auth/authentication.service";
import {CookieService} from "ngx-cookie-service";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ReviewDialogComponent} from "./components/review-dialog/review-dialog.component";
import {Review} from "./entity/Event/Review";
import {ReviewService} from "./services/review.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'eventTeammatesSearchApp';
  private eventIndex = 0;
  private matDialogRef: MatDialogRef<ReviewDialogComponent> | undefined;

  constructor(private matDialog: MatDialog, private eventService: EventService, private authService: AuthenticationService, private cookieService: CookieService, private reviewService: ReviewService) {
    if (true)//!cookieService.check("reviewsLoaded")) {
      this.eventService.getEndedEvents().subscribe(e => {
        var date = new Date();
        date.setDate(Date.now());
        date.setMilliseconds(date.getMilliseconds() + 8.64e7);
        cookieService.set("reviewsLoaded", Date(), {expires: date});
        if (e.length > 0) {
          this.matDialogRef = matDialog.open(ReviewDialogComponent, {
            width: '250px',
            data: e[this.eventIndex]
          });
          this.matDialogRef.afterClosed().subscribe((review: Review) => {
            if (review.reviewWeight > 0) {
              if (review.reviewWeight > 0.5) {

              } else {
                this.reviewService.add(review);
              }
              this.eventIndex++;
              this.matDialogRef = this.matDialog.open(ReviewDialogComponent, {
                width: '250px',
                data: e[this.eventIndex]
              });
            }
          })
        }
      })
  }


}


