import {Component, OnInit} from '@angular/core';
import {ComplaintService} from "../../../services/complaint.service";
import {Complaint} from "../../../entity/Event/Complaint";
import {MatDialog} from "@angular/material/dialog";
import {WarningCreateDialogComponent} from "../../warning-create-dialog/warning-create-dialog.component";
import {ComplaintStatus} from "../../../entity/Event/ComplaintStatus";
import {NoopScrollStrategy} from "@angular/cdk/overlay";

@Component({
  selector: 'app-complaints-panel',
  templateUrl: './complaints-panel.component.html',
  styleUrls: ['./complaints-panel.component.css']
})
export class ComplaintsPanelComponent implements OnInit {
  public complaints: Complaint[] = [];
  public currentComplaints: Complaint[] = [];
  public statusesOfOperations = new WeakMap<any, string>();
  public complaintsStatusesMap = new Map<string, string>();
  public currentStatus = ComplaintStatus.ACCEPTED.toString();
  public items: any[] = [];

  constructor(private complaintsService: ComplaintService, private dialog: MatDialog) {


    this.complaintsStatusesMap = this.complaintsStatusesMap.set(ComplaintStatus.REJECTED, "Отклонены");
    this.complaintsStatusesMap = this.complaintsStatusesMap.set(ComplaintStatus.ACCEPTED, "Обработаны");
    this.complaintsStatusesMap = this.complaintsStatusesMap.set(ComplaintStatus.PENDING, "Не обработаны");
    this.setItems();
    this.complaintsService.findComplaintsAssignedToMeToResolve().subscribe(complaints => {
      this.complaints = complaints;

      this.currentComplaints = this.complaints.filter(e => {
        return e.status === this.currentStatus;
      })
    })
  }

  setItems() {
    var array: any[] = [];
    for (let status of this.complaintsStatusesMap.keys()) {
      array.push({id: status, name: this.complaintsStatusesMap.get(status)});
    }
    this.items = array;
  }

  changeFilter(event: any) {
    this.currentStatus = event;
    this.currentComplaints = this.complaints.filter(e => {
      return e.status === this.currentStatus;
    })
  }

  ngOnInit(): void {

  }

  sendWarning(complaint: Complaint) {
    this.dialog.open(WarningCreateDialogComponent, {
      data: complaint, width: '250px',
      scrollStrategy: new NoopScrollStrategy()
    });
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
