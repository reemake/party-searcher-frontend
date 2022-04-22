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
  public lenMarkModel = "";
  public deepReview: boolean = false;
  public numbers = [1, 2, 3, 4, 5];
  public review: Review | undefined;
  private lenMarks = Object.values(EventLengthMark);

  constructor(
    public dialogRef: MatDialogRef<ReviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Event) {

    this.lengthsMarks = this.lengthsMarks.set("Очень короткое", this.lenMarks[0]);
    this.lengthsMarks = this.lengthsMarks.set("То что надо", this.lenMarks[1]);
    this.lengthsMarks = this.lengthsMarks.set("Очень длинное", this.lenMarks[2]);
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
        reviewWeight: 0.5,
        recommendToOthersMark: 0,
        eventOrganizationMark: 0
        , eventLengthMark: undefined
      }
    } else if (this.review) {
      this.review.eventMark = mark;
    }
  }


  goReview(): Review {
    if (this.review) {
      if (this.deepReview) {
        this.review.reviewWeight = 0.75;
        this.review.eventLengthMark = this.lengthsMarks.get(this.lenMarkModel);
        console.log(this.review)

      } else
        this.review.reviewWeight = 0.5;
      return this.review;
    } else throw new Error("review is undefined");

  }

  onCancel(): void {
    if (!this.review && this.data.id && localStorage.getItem("username") !== null) {
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
        , eventLengthMark: undefined
      }
    }

    this.dialogRef.close(this.review);
  }

  ngOnInit(): void {
  }

}
