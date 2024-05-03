import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { HistoryService } from "src/history/history.service"
import { CvEvents } from "../cv.events";

@Injectable()
export class CvListener {
    private historyService: HistoryService;

    constructor(historyService: HistoryService) {
      this.historyService = historyService;
    }

  @OnEvent(CvEvents.CV_OPERATION, { async: true })
  async handleCvAdded(payload: any) {
    console.log('CV created', payload);
    await this.historyService.addHistoryEntry(payload);

} 
}

