import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/user.decorator';
import { User } from '../user/entities/user.entity';
import { GetCvDto } from './dto/get-cv.dto';
import { AdminGuard } from '../auth/guards/admin.guard';
import { UserService } from '../user/user.service';
import { Request } from 'express';

@Controller({
  path: 'cv',
  version: '1',
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
      fileFilter: (req, file, cb) => {
        const allowedFileTypes = /\.(png|jpeg|jpg)$/i;
        if (!file.originalname.match(allowedFileTypes)) {
          return cb(
            new HttpException(
              'Only PNG, JPEG, and JPG files are allowed',
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        }
        cb(null, true);
      },
      limits: { fileSize: 1000000 },
    }),
  )
  async create(
    @Body() createCvDto: CreateCvDto,
    @UploadedFile() image: Express.Multer.File,
    @CurrentUser() user: User,
  ) {
    createCvDto.path = image ? image.filename : '';
    return await this.cvService.create(createCvDto, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@CurrentUser() user: User): Promise<CV[]> {
    return await this.cvService.findAll(user);
  }

  @Get('filters')
  @UseGuards(JwtAuthGuard)
  async findAllWithFilters(
    @Query('') queryParams: GetCvDto,
    @CurrentUser() user: User,
  ): Promise<CV[]> {
    return await this.cvService.findAllWithFilters(queryParams, user);
  }

  @Get('paginated')
  @UseGuards(JwtAuthGuard, AdminGuard)
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
    @CurrentUser() user: User,
  ): Promise<CV> {
    return await this.cvService.update(id, updateCvDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return await this.cvService.remove(id, user);
  }

  @Get('restore/:id')
  @UseGuards(JwtAuthGuard)
  async restore(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return await this.cvService.restore(id, user);
  }
}

@Controller({
  path: 'cv',
  version: '2',
})
export class Cv2Controller {
  constructor(
    private readonly cvService: CvService,
    private readonly userService: UserService,
  ) {}

  @Get()
  async findAll(@Req() req: Request) {
    const userId = req['userId'];
    return await this.cvService.findAllByUserId(userId);
  }

  @Post()
  async create(@Body() createCvDto: CreateCvDto, @Req() req: Request) {
    const userId = req['userId'];
    const user = await this.userService.findOne(userId);
    console.log('user', user);
    console.log('createCvDto', createCvDto);
    return await this.cvService.create(createCvDto, user);
  }

  @Patch(':id')
  async update(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCvDto: UpdateCvDto,
  ): Promise<CV> {
    const userId = req['userId'];
    const user = await this.userService.findOne(userId);
    return await this.cvService.update(id, updateCvDto, user);
  }

  @Delete(':id')
  async delete(@Req() req: Request, @Param('id') id: number) {
    const userId = req['userId'];
    const user = await this.userService.findOne(userId);
    return await this.cvService.remove(id, user);
  }
}
