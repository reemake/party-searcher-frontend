import {Component, OnInit} from '@angular/core';
import {ComplaintService} from "../../../services/complaint.service";
import {Complaint} from "../../../entity/Event/Complaint";
import {MatDialog} from "@angular/material/dialog";
import {WarningCreateDialogComponent} from "../../warning-create-dialog/warning-create-dialog.component";

@Component({
  selector: 'app-complaints-panel',
  templateUrl: './complaints-panel.component.html',
  styleUrls: ['./complaints-panel.component.css']
})
export class ComplaintsPanelComponent implements OnInit {
  public complaints: Complaint[] = [];
  public statusesOfOperations = new WeakMap<any, string>();

  constructor(private complaintsService: ComplaintService, private dialog: MatDialog) {
    this.complaintsService.findComplaintsAssignedToMeToResolve().subscribe(complaints => {
      this.complaints = complaints;
    })
  }

  ngOnInit(): void {
  }

  sendWarning(complaint: Complaint) {
    this.dialog.open(WarningCreateDialogComponent, {data: complaint});
  }

  rejectComplaint(complaintId: any) {
    this.complaintsService.rejectComplaint(complaintId.userId, complaintId.eventId).subscribe(e => {
      this.statusesOfOperations.set(complaintId, "Операция успешно выполнена")
    }, error => {
      alert("Произошла ошибка " + JSON.stringify(error));
    })
  }

  banComplaintAuthor(userId: string, complaintId: any) {
    this.complaintsService.banComplaintAuthor(userId, complaintId.userId).subscribe(e => {
      this.statusesOfOperations.set(complaintId, "Операция успешно выполнена")
    }, error => {
      alert("Произошла ошибка " + JSON.stringify(error));
    })
  }

  banEvent(eventId: number, complaintId: any) {
    this.complaintsService.banEvent(eventId, complaintId.userId).subscribe(e => {
      this.statusesOfOperations.set(complaintId, "Операция успешно выполнена")
    }, error => {
      alert("Произошла ошибка " + JSON.stringify(error));
    })
  }

  banEventOwner(eventId: number, complaintId: any) {
    this.complaintsService.banEventOwner(eventId, complaintId.userId).subscribe(e => {
      this.statusesOfOperations.set(complaintId, "Операция успешно выполнена")
    }, error => {
      alert("Произошла ошибка " + JSON.stringify(error));
    })
  }

}
