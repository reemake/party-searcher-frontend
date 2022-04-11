import {Message} from "./Message";
import {User} from "../User";

export interface Chat {
  id: number,
  name: string,
  private: boolean
  message?: Message
  isNewFriendChat?: boolean
  users: User[];
}
