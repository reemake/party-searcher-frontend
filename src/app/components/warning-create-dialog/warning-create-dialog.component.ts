import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Complaint} from "../../entity/Event/Complaint";
import {ComplaintService} from "../../services/complaint.service";
import {SuccessDialogComponent} from "../success-dialog/success-dialog.component";

@Component({
  selector: 'app-warning-create-dialog',
  templateUrl: './warning-create-dialog.component.html',
  styleUrls: ['./warning-create-dialog.component.css']
})
export class WarningCreateDialogComponent implements OnInit {
  public warningText = "";

  constructor(public dialogRef: MatDialogRef<WarningCreateDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Complaint, private complaintService: ComplaintService, private dialog: MatDialog) {
  }

  ngOnInit(): void {
  }

  sendWarning() {
    this.complaintService.sendWarningToEventOwner(this.data.id.eventId, this.warningText, this.data.id.userId).subscribe(() => {
        this.dialog.open(SuccessDialogComponent, {data: "Создание предупреждения прошло успешно"})
        this.dialogRef.close();
      },
      error => {
        this.dialog.open(SuccessDialogComponent, {data: "Ошибка при создании предупреждения " + JSON.stringify(error)})
        this.dialogRef.close();
      })

  }

}
