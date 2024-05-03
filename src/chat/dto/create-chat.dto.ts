import { User } from '../../user/entities/user.entity';
import { IsNotEmpty, IsString } from 'class-validator';
import { ChatEntity } from '../entities/chat.entity';

export class CreateChatDto {
  @IsNotEmpty()
  @IsString()
  content: string;
  @IsNotEmpty()
  author: User;
  @IsNotEmpty()
  parent: ChatEntity;
}
