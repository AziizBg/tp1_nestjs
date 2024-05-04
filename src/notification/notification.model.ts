import { CvEvents } from '../cv/cv.events';

export interface Notification {
  id: number;
  title: string;
  content: string;
  isRead: boolean;
  receiverId: number;
  notificationEvent: CvEvents;
}

export type CreateNotification = Omit<Notification, 'id'>;

export type CreateGenericAdminNotification = Omit<
  Notification,
  'id' | 'receiverId'
>;

export interface NotificationEvent {
  getContent(): Promise<string>;
  getTile(): string;
}
