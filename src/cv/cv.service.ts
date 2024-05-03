import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CV } from './entities/cv.entity';
import { Repository } from 'typeorm';
import { GetPaginatedTodoDto } from './dto/get-paginated-cvs.dto';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { GetCvDto } from './dto/get-cv.dto';
import { UserRoleEnum } from '../Generics/Enums/role-user.enum';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CvEvents } from './cv.events';
@Injectable()
export class CvService {
  constructor(
    @InjectRepository(CV)
    private cvRepository: Repository<CV>,
    private userService: UserService,
    private eventEmitter: EventEmitter2,
  ) {}
  async create(cv: CreateCvDto, user: User) {
    // return await this.cvRepository.save(cv);
    const newCv =  this.cvRepository.create(cv);
    await this.cvRepository.save(newCv);
    return 'CV created successfully';
  }

  async findAll(user: User): Promise<CV[]> {
    if (user.role === UserRoleEnum.ADMIN) return await this.cvRepository.find();
    return await this.cvRepository.find({ where: { user: { id: user.id } } });
  }

  async findAllByUserId(id: number): Promise<CV[]> {
    const cvs = await this.cvRepository.find({ relations: ['user'] });
    return cvs.filter((cv) => cv.user?.id === id);
  }

  async findAllWithFilters(queryParams: GetCvDto, user: User): Promise<CV[]> {
    const { critere, age } = queryParams;
    let query = this.cvRepository.createQueryBuilder('cv');

    if (critere) {
      query.where(
        '(cv.name LIKE :critere OR cv.firstname LIKE :critere OR cv.job LIKE :critere)',
        { critere: `%${critere}%` },
      );
    }

    if (age) {
      query = query.andWhere('cv.age = :age', { age: parseInt(age, 10) });
    }
    if (user.role === UserRoleEnum.ADMIN) {
      return await query.getMany();
    }
    query = query.andWhere('cv.userId = :userId', { userId: user.id });
    return await query.getMany();
  }
  async findAllPaginated(queryParams: GetPaginatedTodoDto) {
    const { page, nbPerPage } = queryParams;

    //the default value of page is 1 => start from the first page
    const realPage = page || 1;

    //the default value of nbPerPage is the total number of CVs in the database
    const realNbPerPage = nbPerPage || (await this.cvRepository.count());

    return await this.cvRepository.find({
      take: realNbPerPage,
      skip: realNbPerPage * (realPage - 1),
    });
  }

  async findOne(id: number){
    const cv =await this.cvRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    return cv; 
  }

  async update(id: number, updateCvDto: UpdateCvDto, user: User): Promise<CV> {
    const cv = await this.findOne(id);
    const newCv = await this.cvRepository.preload({
      id,
      ...updateCvDto,
    });
    if (!newCv) {
      throw new NotFoundException(`CV with id ${id} not found`);
    }
    if (user.role === UserRoleEnum.ADMIN || cv.user?.id === user.id){
      this.eventEmitter.emit(CvEvents.CV_OPERATION, {
        operationType: CvEvents.CV_UPDATED,
        cvId: id,
        userId: user.id,
      });
      return await this.cvRepository.save(newCv);
    }
    else
      throw new UnauthorizedException(
        'You are not authorized to update this CV',
      );
  }

  // async remove(id: number) {
  //   const cvToRemove = await this.cvRepository.findOneBy({id});
  //   if (!cvToRemove) {
  //     throw new NotFoundException(CV with id ${id} not found);
  //   }
  //   return await this.cvRepository.remove(cvToRemove);
  // }

  async remove(id: number, user: User) {
    const cvToRemove = await this.findOne(id);
    if (!cvToRemove) {
      throw new NotFoundException(`CV with id ${id} not found`);
    }

    if (user.role === UserRoleEnum.ADMIN || cvToRemove.user.id === user.id){
      this.eventEmitter.emit(CvEvents.CV_OPERATION, {
        operationType: CvEvents.CV_DELETED,
        cvId: id,
        userId: user.id,
      });
      return await this.cvRepository.softDelete(id);
    }
    else
      throw new UnauthorizedException(
        'You are not authorized to delete this CV',
      );
  }

  async restore(id: number, user: User) {
    const [cv] = await this.cvRepository.query(
      'SELECT * FROM cv WHERE id = ? LIMIT 1',
      [id],
    );

    if (user.role === UserRoleEnum.ADMIN || cv.userId === user.id){
      this.eventEmitter.emit(CvEvents.CV_OPERATION, {
        operationType: CvEvents.CV_RESTORED,
        cvId: id,
        userId: user.id,
      });
      return await this.cvRepository.restore(id);}
    else
      throw new UnauthorizedException(
        'You are not authorized to restore this CV',
      );
  }

  async findAllForSeeder(): Promise<CV[]> {
    return await this.cvRepository.find();
  }

  async createForSeeder(cv: CV): Promise<CV> {
    return await this.cvRepository.save(cv);
  }
}
