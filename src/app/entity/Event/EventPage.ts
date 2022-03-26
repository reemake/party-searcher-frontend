import {Event} from "./Event";

export interface EventPage {
  totalPages: number
  content: Array<Event>
  pageable: {
    pageNumber: number
  }
}
