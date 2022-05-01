import {Role} from "./Role";

export class User {
  login:string;
  firstName:string;
  lastName:string;
  email:string;
  password:string;
  phone:string;
  commercialUser:boolean;
  commercialUserCreated:boolean;
  pictureUrl:string;
  organizationName:string;
  description:string;
  authorities?:Role[]
  constructor(){}
}
