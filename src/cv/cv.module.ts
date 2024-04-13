import { Module } from '@nestjs/common';
import { CvService } from './cv.service';
import { CvController } from './cv.controller';
import { Cv2Controller } from './cv2.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CV } from './entities/cv.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CV])],
  // controllers: [CvController, Cv2Controller],
  controllers: [CvController],
  providers: [CvService],
})
export class CvModule {}
