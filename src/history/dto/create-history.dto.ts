import { IsNotEmpty } from "class-validator";
import { CvEvents } from "src/cv/cv.events";

export class CreateHistoryDto {
  @IsNotEmpty()
  operationType: CvEvents;
  @IsNotEmpty()
  cvId: number;
  @IsNotEmpty()
  userId: number;
}
