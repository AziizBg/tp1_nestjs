import { Injectable, NotFoundException } from '@nestjs/common';
import {
  DeepPartial,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
  UpdateResult,
} from 'typeorm';
import { HasId } from './hasId.interface';

@Injectable()
export class CrudService<Entity extends HasId> {
  constructor(private repository: Repository<Entity>) {}

  create(entity: DeepPartial<Entity>): Promise<Entity> {
    return this.repository.save(entity);
  }

  async update(id: number, updateDto: DeepPartial<Entity>): Promise<Entity> {
    const entity = await this.repository.preload({
      id,
      ...updateDto,
    });
    if (!entity) {
      throw new NotFoundException('entity Not Found');
    }
    return this.repository.save(entity);
  }

  async remove(id: number): Promise<UpdateResult> {
    const result = await this.repository.softDelete(id);
    if (!result.affected) {
      throw new NotFoundException('entity Not Found');
    }
    return result;
  }
  async restore(id: number): Promise<UpdateResult> {
    const result = await this.repository.restore(id);
    if (!result.affected) {
      throw new NotFoundException('entity Not Found');
    }
    return result;
  }

  findAll(): Promise<Entity[]> {
    return this.repository.find();
  }

  findOne(id: number) {
    const findOptions: FindOneOptions<Entity> = {
      where: {
        id: id,
      } as FindOptionsWhere<Entity>,
    };
    return this.repository.findOne(findOptions);
  }
}
