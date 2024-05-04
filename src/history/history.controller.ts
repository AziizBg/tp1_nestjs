import { Controller,Sse, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HistoryService } from './history.service';

import { interval, map, Observable } from 'rxjs';
import { EventEmitter2 } from '@nestjs/event-emitter';


@Controller('history')
export class HistoryController {
  private eventEmitter : EventEmitter2;
  constructor(private readonly historyService: HistoryService, eventEmitter: EventEmitter2){
    this.historyService = historyService;
    this.eventEmitter = eventEmitter;
  }

    @Sse('events-for-user')
    sseEvents() {
      return this.historyService.userNotificationStream().pipe(
        map(notification => ({ data: notification })),
      );
    }

  }



