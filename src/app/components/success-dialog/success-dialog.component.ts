import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-success-dialog',
  templateUrl: './success-dialog.component.html',
  styleUrls: ['./success-dialog.component.css']
})
export class SuccessDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<SuccessDialogComponent>) {
    dialogRef.afterOpened().subscribe(e => {
      setInterval(() => {
        this.dialogRef.close();
      }, 4000)
    })
  }

  ngOnInit(): void {
  }

}
