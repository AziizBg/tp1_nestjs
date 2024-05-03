import { User } from '../../user/entities/user.entity';
import { IsNotEmpty, IsString } from 'class-validator';
import { ChatEntity } from '../entities/chat.entity';

export class LikeDto {
  @IsNotEmpty()
  owner: User;
  @IsNotEmpty()
  message: ChatEntity;
}
