import { Injectable } from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Skill } from './entities/skill.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SkillService {

  constructor(
    @InjectRepository(Skill)
    private skillRepository: Repository<Skill>,
  ){}

  create(createSkillDto: CreateSkillDto) {
    return this.skillRepository.save(createSkillDto);
  }

  findAll() {
    return this.skillRepository.find();
  }

  findOne(id: number) {
    return this.skillRepository.findOne({where: {id}});
  }

  update(id: number, updateSkillDto: UpdateSkillDto) {
    return this.skillRepository.update(id, updateSkillDto);
  }

  remove(id: number) {
    return this.skillRepository.softDelete(id);
  }
}
