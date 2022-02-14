interface EventDescription {
  id: number
  description: string
  name: string
  dateTimeStart: Date
  dateTimeEnd: Date
  maxNumberOfGuests: number
  price: number
  owner: EventOwner
  chatId: number
  currentUserEntered: boolean
  tags: Array<ThemeTag>

}
