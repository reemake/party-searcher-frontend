export interface Message {
  id?: number,
  text: string,
  sendTime: Date,
  chatId: number,
  userId: string,
  messagesImagesUrl: string[]
}