import { Controller, Sse } from '@nestjs/common';
import { interval, map, Observable } from 'rxjs';
import { NotificationService } from './notification.service';

interface MessageEvent {
  data: string | object;
}

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {
  }

  
  @Sse('events-for-user')
  sseEvents(): Observable<MessageEvent> {
    return this.notificationService.userNotificationStream().pipe(
      map(notification => ({ data: notification })),
    );
  }

  @Sse('test-sse')
  sseTest(): Observable<MessageEvent> {
    return interval(1000).pipe(
      map((count) => ({ data: `Test message ${count}` })),
    );
  }

  @Sse('events-for-admins')
  sseEventsForAdmins(): Observable<MessageEvent> {
    return this.notificationService.adminNotificationsStream().pipe(
      map(notification => ({ data: notification })),
    );
  }

}
