import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";

@Injectable()
export class CvListener{
    @OnEvent('cv.created')
    async handleCvAdded(payload: any){
        console.log('A new cv has been added');
        console.log(payload);
    }
}
