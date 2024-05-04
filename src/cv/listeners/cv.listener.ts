import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { HistoryService } from "src/history/history.service"
import { CvEvents } from "../cv.events";
import { CvService } from "../cv.service";
import { UserService } from "src/user/user.service";

@Injectable()
export class CvListener {
    private historyService: HistoryService;
    private cvService: CvService;
    private userService : UserService;
    

    constructor(historyService: HistoryService, cvService: CvService, userService:UserService) {
      this.historyService = historyService;
      this.cvService = cvService;
      this.userService= userService
    }

  @OnEvent(CvEvents.CV_OPERATION, { async: true })
  async handleCvEvents(payload: any) {
    // const cv = await this.cvService.findOne(payload.cvId);
    // payload.cv = cv;
    const user = await this.userService.findOne(payload.userId);
    payload.user= user;
    const savedOperation =  this.historyService.addHistoryEntry(payload);
    payload.date = (await savedOperation).createdAt;
    // console.log(payload.operationType, payload);
  } 
}

