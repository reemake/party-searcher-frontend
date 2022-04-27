export interface Review {
  id: {
    eventId: number,
    userId: string
  },
  text?: string,
  eventMark: number,
  eventOrganizationMark: number
  recommendToOthersMark: number,
  reviewWeight: number
  eventLengthMark?: string;
  notReady?: boolean
}

export enum EventLengthMark {
  TOO_SHORT = "TOO_SHORT",
  TOO_LONG = "TOO_LONG",
  FINE = "FINE"
}
