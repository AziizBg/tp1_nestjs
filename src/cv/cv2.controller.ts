import {
  Controller,
  Get,
  Delete,
  Req,
  Param,
  UnauthorizedException,
  Body,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';
import { Request } from 'express';
import { CvService } from './cv.service';
import { UpdateCvDto } from './dto/update-cv.dto';
import { CV } from './entities/cv.entity';

@Controller({
  path: 'cv',
  version: '2',
})
export class Cv2Controller {
  constructor(private readonly cvService: CvService) {}

  @Get()
  async findAll(@Req() req: Request) {
    // const UserId = req['userId'];
    const UserId = 2;
    return this.cvService.findAllByUserId(UserId);
  }

  @Patch(':id')
  async update(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCvDto: UpdateCvDto,
  ): Promise<CV> {
    // const userId = req['userId'];
    const userId = 2;
    const cv = await this.cvService.findOne(id);
    if (cv && cv.user.id !== userId  ) {
      throw new UnauthorizedException(
        'You are not authorized to update this CV',
      );
    } else {
      return await this.cvService.update(id, updateCvDto);
    }
  }

  @Delete(':id')
  async delete(@Req() req: Request, @Param('id') id: number) {
    // const userId = req['userId'];
    const userId = 2;
    const cv = await this.cvService.findOne(id);
    if (cv && cv.user.id !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to delete this CV',
      );
    } else {
      return await this.cvService.softDelete(id);
    }
  }
}
