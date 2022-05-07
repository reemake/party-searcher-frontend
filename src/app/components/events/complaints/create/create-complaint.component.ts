import {Component, OnInit} from '@angular/core';
import {Complaint} from "../../../../entity/Event/Complaint";
import {ActivatedRoute} from "@angular/router";
import {ComplaintStatus} from "../../../../entity/Event/ComplaintStatus";
import {ComplaintService} from "../../../../services/complaint.service";
import {MatDialog} from "@angular/material/dialog";
import {SuccessDialogComponent} from "../../../success-dialog/success-dialog.component";

@Component({
  selector: 'app-create',
  templateUrl: './create-complaint.component.html',
  styleUrls: ['./create-complaint.component.css']
})
export class CreateComplaintComponent implements OnInit {
  public complaint: Complaint;

  constructor(private activatedRoute: ActivatedRoute, private complaintService: ComplaintService, private dialog: MatDialog) {
    activatedRoute.queryParams.subscribe(params => {
      var eventId = params['eventId'];
      var userLogin = localStorage.getItem("username");
      if (userLogin) {
        this.complaint = {
          id: {
            eventId: eventId,
            userId: userLogin
          },
          status: ComplaintStatus.PENDING,
          text: '',
          event:{id:eventId},
          user:{login:userLogin}
        }
      }
    })
  }


  createComplaint() {
    this.complaintService.send(this.complaint).subscribe(success => {
      this.dialog.open(SuccessDialogComponent, {data: "Ваша жалоба успешно отправлена"});
    }, error => {
      this.dialog.open(SuccessDialogComponent, {data: "При отправке жалобы произошла ошибка " + JSON.stringify(error)});
    });
  }

  ngOnInit(): void {
  }

}
