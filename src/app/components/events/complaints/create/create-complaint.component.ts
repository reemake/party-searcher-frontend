import {Component, OnInit} from '@angular/core';
import {Complaint} from "../../../../entity/Event/Complaint";
import {ActivatedRoute} from "@angular/router";
import {ComplaintStatus} from "../../../../entity/Event/ComplaintStatus";

@Component({
  selector: 'app-create',
  templateUrl: './create-complaint.component.html',
  styleUrls: ['./create-complaint.component.css']
})
export class CreateComplaintComponent implements OnInit {
  public complaint:Complaint;

  constructor(private activatedRoute:ActivatedRoute) {
    activatedRoute.queryParams.subscribe(params=>{
      var eventId=params['eventId'];
      var userLogin=localStorage.getItem("username");
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

  createComplaint(){

  }

  ngOnInit(): void {
  }

}
