import { Controller, Sse, UseGuards } from '@nestjs/common';
import { interval, map, Observable } from 'rxjs';
import { NotificationService } from './notification.service';
import { CurrentUser } from '../decorators/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';


interface MessageEvent {
  data: string | object;
}

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {
  }

  @UseGuards(JwtAuthGuard)
  @Sse('events-for-user')
  sseEvents(@CurrentUser() user: User): Observable<MessageEvent> {
    console.log("user:", user);
    return this.notificationService.userNotificationStream(user).pipe(
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
