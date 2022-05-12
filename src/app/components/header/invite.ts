import { EventOwner } from '../../entity/Event/EventOwner';
import { EventType } from '../../entity/Event/EventType';
import { EventAttendance } from '../../entity/Event/EventAttendance';
import { User } from '../../entity/User';

export class Invite {
    id: number
    description: string
    name: string
    eventType: EventType
    isOnline: boolean
    isPrivate: boolean
    location: Location
    url: string
    dateTimeStart: Date
    dateTimeEnd: Date
    maxNumberOfGuests: number
    price: number
    owner: EventOwner
    chatId: number
    currentUserEntered: boolean
    theme: string
    tags: Array<string>
    guests: Array<EventAttendance>
    invitedGuests: Array<User>
}
