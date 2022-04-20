import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Event} from "../../entity/Event/Event";
import {Review} from "../../entity/Event/Review";

@Component({
  selector: 'app-review-dialog',
  templateUrl: './review-dialog.component.html',
  styleUrls: ['./review-dialog.component.css']
})
export class ReviewDialogComponent implements OnInit {
  public numbers = [1, 2, 3, 4, 5];
  public review: Review | undefined;

  constructor(
    public dialogRef: MatDialogRef<ReviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Event) {

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
        reviewWeight: 0.5
      }
    } else if (this.review) {
      this.review.eventMark = mark;
    }
  }

  goToDeepReview(): Review {
    if (this.review) {
      this.review.reviewWeight = 0.75;
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
        reviewWeight: 0
      }
    }

    this.dialogRef.close(this.review);
  }

  ngOnInit(): void {
  }

}
