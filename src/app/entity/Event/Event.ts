import {ThemeTag} from "./ThemeTag";
import {EventOwner} from "./EventOwner";
import {Location} from "../Location";
import {EventAttendance} from "./EventAttendance";

export interface Event {
  id: number
  description: string
  name: string
  isOnline: boolean
  location: Location
  url: string | null
  dateTimeStart: Date
  dateTimeEnd: Date
  maxNumberOfGuests: number
  price: number
  owner: EventOwner
  chatId: number
  currentUserEntered: boolean
  tags: Array<ThemeTag>
  guests: Array<EventAttendance>

}
