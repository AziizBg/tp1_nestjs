import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PayloadInterface } from '../interfaces/payload.interface';
import { Repository } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: PayloadInterface) {
    // console.log(payload);
    const user = await this.userRepository.findOneBy({
      username: payload.username,
    });

    if (user) {
      // console.log('user', user);
      // console.log('payload', payload);
      delete user.salt;
      delete user.password;
      return user;
    } else {
      throw new UnauthorizedException();
    }
  }
}
