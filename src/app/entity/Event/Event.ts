import {EventOwner} from "./EventOwner";
import {Location} from "../Location";
import {EventAttendance} from "./EventAttendance";
import {Tag} from "./Tag";
import {EventType} from "./EventType";

export interface Event {
  id?: number
  description: string
  name: string
  eventType: EventType
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
  guests: Array<EventAttendance>,
  hasChatWithOwner: boolean
  avgMark?: number
}
