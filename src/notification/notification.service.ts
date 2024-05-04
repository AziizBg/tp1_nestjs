import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CvEvents } from '../cv/cv.events';
import { CreateCvDto } from '../cv/dto/create-cv.dto';
import { CreateGenericAdminNotification, CreateNotification } from './notification.model';
import { Observable } from 'rxjs';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class NotificationService {
  constructor(private eventEmitter: EventEmitter2) {}

  userNotificationStream(user: User): Observable<CreateNotification> {
    return new Observable<CreateNotification>(observer => {
      this.eventEmitter.on(CvEvents.CV_OPERATION, (data) => {
        const notification: CreateNotification = {
          title: data.operationType,
          content: `${data.operationType} a été effectué sur le CV avec l'ID ${data.cvId}.`, 
          receiverId: data.userId,
          notificationEvent: data.operationType,
          isRead: false,
        };
        console.log("============================================");
        console.log("user notif");
        console.log("from notification:", notification);
        console.log("data:", data);
        if(data.userId == user.id){
          observer.next(notification);
        }
        else{
          console.log("Not the same user");
        }
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
      this.eventEmitter.on(CvEvents.CV_OPERATION, (data) => {
        const notification: CreateGenericAdminNotification = {
          title: data.operationType,
          content: `${data.operationType} a été effectué sur le CV avec l'ID ${data.cvId}.`,
          notificationEvent: data.operationType,  
          isRead: false,
        };
        console.log('===============================');
        console.log('admin notif');
        console.log(notification);
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
