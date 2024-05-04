import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CvEvents } from '../cv/cv.events';
import { CreateCvDto } from '../cv/dto/create-cv.dto';
import { CreateGenericAdminNotification, CreateNotification } from './notification.model';
import { Observable } from 'rxjs';

@Injectable()
export class NotificationService {
  constructor(private eventEmitter: EventEmitter2) {}

  userNotificationStream(): Observable<CreateNotification> {
    return new Observable<CreateNotification>(observer => {
      this.eventEmitter.on(CvEvents.CV_DELETED, ({ cvId, userId }) => {
        const notification: CreateNotification = {
          title: 'CV Supprimé',
          content: `Le CV avec l'ID ${cvId} a été supprimé.`,
          receiverId: userId,
          notificationEvent: CvEvents.CV_DELETED,
          isRead: false,
        };
        observer.next(notification);
      });
      //
      // this.eventEmitter.on(CvEvents.CV_CREATED, ({ cvId, userId }) => {
      //   const notification: CreateNotification = {
      //     title: 'CV Créé',
      //     content: `Le CV avec l'ID ${cvId} a été créé.`,
      //     receiverId: userId,
      //     notificationEvent: CvEvents.CV_CREATED,
      //     isRead: false,
      //   };
      //   observer.next(notification);
      // });
      //
      // this.eventEmitter.on(CvEvents.CV_UPDATED, ({ cvId, userId }) => {
      //   const notification: CreateNotification = {
      //     title: 'CV Modifié',
      //     content: `Le CV avec l'ID ${cvId} a été modifié.`,
      //     receiverId: userId,
      //     notificationEvent: CvEvents.CV_UPDATED,
      //     isRead: false,
      //   };
      //   observer.next(notification);
      // });
      //
      // this.eventEmitter.on(CvEvents.CV_RESTORED, ({ cvId, userId }) => {
      //   const notification: CreateNotification = {
      //     title: 'CV Restauré',
      //     content: `Le CV avec l'ID ${cvId} a été restauré.`,
      //     receiverId: userId,
      //     notificationEvent: CvEvents.CV_RESTORED,
      //     isRead: false,
      //   };
      //   observer.next(notification);
      // });
    });
  }

  adminNotificationsStream(): Observable<CreateGenericAdminNotification> {
    return new Observable<CreateGenericAdminNotification>(observer => {
      this.eventEmitter.on(CvEvents.CV_DELETED, ({ cvId }) => {
        const notification: CreateGenericAdminNotification = {
          title: 'CV Supprimé',
          content: `Le CV avec l'ID ${cvId} a été supprimé.`,
          notificationEvent: CvEvents.CV_DELETED,
          isRead: false,
        };
        observer.next(notification);
      });
      // this.eventEmitter.on(CvEvents.CV_CREATED, ({ cvId, userId }) => {
      //   const notification: CreateGenericAdminNotification = {
      //     title: 'CV Créé',
      //     content: `Le CV avec l'ID ${cvId} a été créé.`,
      //     notificationEvent: CvEvents.CV_CREATED,
      //     isRead: false,
      //   };
      //   observer.next(notification);
      // });
      //
      // this.eventEmitter.on(CvEvents.CV_UPDATED, ({ cvId, userId }) => {
      //   const notification: CreateGenericAdminNotification = {
      //     title: 'CV Modifié',
      //     content: `Le CV avec l'ID ${cvId} a été modifié.`,
      //     notificationEvent: CvEvents.CV_UPDATED,
      //     isRead: false,
      //   };
      //   observer.next(notification);
      // });
      //
      // this.eventEmitter.on(CvEvents.CV_RESTORED, ({ cvId, userId }) => {
      //   const notification: CreateGenericAdminNotification = {
      //     title: 'CV Restauré',
      //     content: `Le CV avec l'ID ${cvId} a été restauré.`,
      //     notificationEvent: CvEvents.CV_RESTORED,
      //     isRead: false,
      //   };
      //   observer.next(notification);
      // });
    });
  }
}
