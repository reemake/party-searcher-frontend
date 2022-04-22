import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Event} from "../../entity/Event/Event";
import {EventLengthMark, Review} from "../../entity/Event/Review";

@Component({
  selector: 'app-review-dialog',
  templateUrl: './review-dialog.component.html',
  styleUrls: ['./review-dialog.component.css']
})
export class ReviewDialogComponent implements OnInit {
  public lengthsMarks = new Map<string, string>();
  public lengthsKeys: string[] = [];
  public lenMarkModel = "";
  public deepReview: boolean = false;
  public numbers = [1, 2, 3, 4, 5];
  public review: Review | undefined;
  private lenMarks = Object.values(EventLengthMark);

  constructor(
    public dialogRef: MatDialogRef<ReviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Event) {
  }

  ngOnInit(): void {

    this.lengthsMarks = this.lengthsMarks.set("Очень короткое", this.lenMarks[0]);
    this.lengthsMarks = this.lengthsMarks.set("Очень длинное", this.lenMarks[1]);
    this.lengthsMarks = this.lengthsMarks.set("То что надо", this.lenMarks[2]);
    for (let val of this.lengthsMarks.keys()) {
      this.lengthsKeys.push(val);
    }
  }

  onChange(mark: number) {
    if (!this.review && this.data.id && localStorage.getItem("username") !== null) {
      var name: string = localStorage.getItem("username") || "";
      this.review = {
        id: {
          userId: name,
          eventId: this.data.id
        },
        eventMark: mark,
        reviewWeight: 0.8,
        recommendToOthersMark: 1,
        eventOrganizationMark: 1
        , eventLengthMark: undefined
      }
    } else if (this.review) {
      this.review.eventMark = mark;
    }
  }


  goReview(): Review {
    if (this.review) {
      if (!this.review.notReady) {
        if (this.deepReview) {
          this.review.reviewWeight = 1;
          this.review.eventLengthMark = this.lengthsMarks.get(this.lenMarkModel);
        } else {
          this.review.reviewWeight = 0.85;
          this.review.eventLengthMark = undefined;
          this.review.eventOrganizationMark = 0;
          this.review.recommendToOthersMark = 0;
        }
      }
      return this.review;
    } else throw new Error("review is undefined");

  }

  onCancel(): void {
    if (this.data.id && localStorage.getItem("username") !== null) {
      var name: string = localStorage.getItem("username") || "";
      this.review = {
        id: {
          userId: name,
          eventId: this.data.id
        },
        eventMark: 0,
        reviewWeight: 0,
        recommendToOthersMark: 0,
        eventOrganizationMark: 0
        , eventLengthMark: undefined,
        notReady: true
      }
    }
    this.dialogRef.close(this.review);
  }


}
