import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CvService } from './cv.service';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CV } from './entities/cv.entity';
import { GetPaginatedTodoDto } from './dto/get-paginated-cvs.dto';
import { GetCvDto } from './dto/get-cv.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from 'src/decorators/user.decorator';

@Controller({
  path: 'cv',
  // version: '1',
})
export class CvController {
  constructor(private readonly cvService: CvService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, Date.now() + '-' + file.originalname);
        },
      }),
    }),
  )
  async create(
    @Body() createCvDto: CreateCvDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000000 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    image: Express.Multer.File,
  ): Promise<CV> {
    createCvDto.path = image ? image.path : '';
    return await this.cvService.create(createCvDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<CV[]> {
    return await this.cvService.findAll();
  }

  @Get('filters')
  @UseGuards(JwtAuthGuard)
  async findAllWithFilters(@Query('') queryparams: GetCvDto): Promise<CV[]> {
    return await this.cvService.findAllWithFilters(queryparams);
  }

  @Get('paginated')
  @UseGuards(JwtAuthGuard)
  async findPaginated(@Query() queryParams: GetPaginatedTodoDto) {
    return await this.cvService.findAllPaginated(queryParams);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.cvService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCvDto: UpdateCvDto,
  ): Promise<CV> {
    return await this.cvService.update(id, updateCvDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.cvService.softDelete(id);
  }

  @Get('restore/:id')
  @UseGuards(JwtAuthGuard)
  async restore(@Param('id', ParseIntPipe) id: number) {
    return await this.cvService.restore(id);
  }
}
