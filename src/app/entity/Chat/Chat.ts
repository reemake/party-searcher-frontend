import {Message} from "./Message";
import {ChatUser} from "./ChatUser";

export interface Chat {
  id: number,
  name: string,
  private: boolean
  message?: Message
  isNewFriendChat?: boolean
  chatUsers: ChatUser[];
  lastReadMessage?: number
}
