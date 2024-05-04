import { Injectable } from '@nestjs/common';
import { CreateHistoryDto } from './dto/create-history.dto';
import { UpdateHistoryDto } from './dto/update-history.dto';
import { History } from './entities/history.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable } from 'rxjs';
import { CvEvents } from 'src/cv/cv.events';
import { CreateNotification } from 'src/notification/notification.model';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class HistoryService {
  private eventEmitter: EventEmitter2;
  constructor(    @InjectRepository(History) private historyRepository: Repository<History>) {}

  async addHistoryEntry(entry: CreateHistoryDto): Promise<History> { 
    return this.historyRepository.save(entry);
  }

  userNotificationStream(): Observable<CreateNotification> {
    return new Observable<CreateNotification>(observer => {
      this.eventEmitter.on(CvEvents.CV_OPERATION, ({ cvId, userId }) => {
        const notification: CreateNotification = {
          title: 'CV Supprimé',
          content: `Le CV avec l'ID ${cvId} a été supprimé.`,
          receiverId: userId,
          notificationEvent: CvEvents.CV_DELETED,
          isRead: false,
        };
        console.log('Notification created:', notification);
        observer.next(notification);
      });
    }
  );
}

}
