import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatEntity } from './entities/chat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatEntity])],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
