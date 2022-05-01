import {ComplaintStatus} from "./ComplaintStatus";

export interface Complaint{
  id:{
    eventId:number,
    userId:string
  },
  event:{
    id:number
  },
  user:{
    login:string
  },
  status:ComplaintStatus,
  complaintResolver?:{
    login:string
  },
  text:string
}
