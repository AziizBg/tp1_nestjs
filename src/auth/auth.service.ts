import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../user/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginCredentialsDto } from './dto/login-credentials.dto';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}
  async register(createUserDto: CreateUserDto): Promise<Partial<User>> {
    const user = this.userRepository.create({
      ...createUserDto,
    });
    user.salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, user.salt);
    try {
      await this.userRepository.save(user);
    } catch (e) {
      throw new ConflictException('Username and email must be unique');
    }
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };
  }

  async login(
    credentials: LoginCredentialsDto,
  ): Promise<{ access_token: string }> {
    const { username, password } = credentials;
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :username or user.email = :username ', {
        username,
      })
      .getOne();
    console.log('user', user);
    if (!user) {
      throw new NotFoundException('username or password is incorrect');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new NotFoundException('username or password is incorrect');
    }
    const payload = {
      username: user.username,
      email: user.email,
      role: user.role,
    };
    const jwt = await this.jwtService.signAsync(payload);
    return {
      access_token: jwt,
    };
  }
}
