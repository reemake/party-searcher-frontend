export interface Notification {
  id: number,
  userId: string,
  notificationTime: Date,
  title: string,
  description: string,
  shown: boolean
}
