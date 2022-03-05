import {EventOwner} from "./EventOwner";
import {Location} from "../Location";
import {EventAttendance} from "./EventAttendance";
import {Tag} from "./Tag";

export interface Event {
  id?: number
  description: string
  name: string
  isOnline: boolean
  isPrivate: boolean
  location?: Location
  url?: string
  dateTimeStart: Date
  dateTimeEnd: Date
  maxNumberOfGuests: number
  price: number
  owner?: EventOwner
  chatId?: number
  currentUserEntered?: boolean,
  theme: string,
  tags: Array<Tag>
  guests: Array<EventAttendance>

}
