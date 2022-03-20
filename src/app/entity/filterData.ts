import {EventType} from "./Event/EventType";

export interface FilterData {
  keyWords: Array<string>
  eventType: EventType | null
  eventLengthFrom: number
  eventLengthTo: number
  eventBeginTimeFrom: Date
  eventBeginTimeTo: Date
  guestsCountFrom: number
  guestsCountTo: number
  priceFrom: number
  priceTo: number
  theme: string
  maxDistance: number
  eventOwnerRating: number
  eventFormats: Array<string>
  userLocation: number[]


}
