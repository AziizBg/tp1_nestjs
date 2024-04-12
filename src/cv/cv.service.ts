import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CV } from './entities/cv.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CvService {
  constructor(
    @InjectRepository(CV)
    private cvRepository: Repository<CV>,
  ) {}
  async create(cv: CreateCvDto): Promise<CV> {
    return await this.cvRepository.save(cv);
  }

  async findAll(): Promise<CV[]> {
    return await this.cvRepository.find();
  }

  async findOne(id: number): Promise<CV | null> {
    return await this.cvRepository.findOneBy({ id });
  }

  async update(id: number, updateCvDto: UpdateCvDto): Promise<CV> {
    const newCv = await this.cvRepository.preload({
      id,
      ...updateCvDto,
    });
    if (!newCv) {
      throw new NotFoundException(`CV with id ${id} not found`);
    }
    return await this.cvRepository.save(newCv);
  }

  // async remove(id: number) {
  //   const cvToRemove = await this.cvRepository.findOneBy({id});
  //   if (!cvToRemove) {
  //     throw new NotFoundException(`CV with id ${id} not found`);
  //   }
  //   return await this.cvRepository.remove(cvToRemove);
  // }

  async softDelete(id: number) {
    const cvToRemove = await this.cvRepository.findOneBy({ id });
    if (!cvToRemove) {
      throw new NotFoundException(`CV with id ${id} not found`);
    }
    return await this.cvRepository.softDelete(id);
  }

  async restore(id: number) {
    return await this.cvRepository.restore(id);
  }
}
