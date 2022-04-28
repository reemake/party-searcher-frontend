export class Message {
  id?: number
  text: string
  sendTime: Date
  chatId: number
  userId: string
  messageImagesUrls: string[]
  removed?: boolean
  focus?: boolean
}
