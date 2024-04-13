import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(user: CreateUserDto): Promise<User> {
    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository
      .find
      // {
      // relations: {
      //   cvs: true,
      // },
      // }
      ();
  }

  async findOne(id: number): Promise<User | null> {
    return await this.userRepository.findOneBy({ id });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const newUser = await this.userRepository.preload({
      id,
      ...updateUserDto,
    });
    if (!newUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return await this.userRepository.save(newUser);
  }

  // async remove(id: number) {
  //  const userToRemove = await this.userRepository.findOneBy({id});
  //   if (!userToRemove) {
  //     throw new NotFoundException(`User with id ${id} not found`);
  //   }
  //   return await this.userRepository.remove(userToRemove);
  // }

  async softDelete(id: number) {
    const userToRemove = await this.userRepository.findOneBy({ id });
    if (!userToRemove) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return await this.userRepository.softDelete(id);
  }

  async restore(id: number) {
    return await this.userRepository.restore(id);
  }
}
