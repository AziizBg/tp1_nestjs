import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatEntity } from './entities/chat.entity';
import { IsNull, Repository } from 'typeorm';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatEntity)
    private readonly ChatRepository: Repository<ChatEntity>,
  ) {}
  clientToUser: any = {};
  private organizeMessages(messages: any[]): any[] {
    const organizedMessages = [];
    const map = new Map();

    messages.forEach((message) => {
      map.set(message.id, {
        ...message,
        replies: [],
        author: {
          username: message.author.username,
          role: message.author.role,
          id: message.author.id,
        },
      });
    });

    messages.forEach((message) => {
      if (message.parent) {
        const parentMessage = map.get(message.parent.id);
        if (parentMessage) {
          parentMessage.replies.push(map.get(message.id));
        } else {
          organizedMessages.forEach((orgMessage) => {
            if (orgMessage.id === message.parent.id) {
              orgMessage.replies.push(map.get(message.id));
            }
          });
        }
      } else {
        organizedMessages.push(map.get(message.id));
      }
    });

    return organizedMessages;
  }
  private findMessageById(messages: any[], id: number): any | null {
    for (const message of messages) {
      if (message.id === id) {
        return message; // Found the message
      }
      if (message.replies && message.replies.length > 0) {
        const foundInReplies = this.findMessageById(message.replies, id);
        if (foundInReplies) {
          return foundInReplies; // Found the message in replies
        }
      }
    }
    return null;
  }
  async createMessage(createChatDto: CreateChatDto) {
    const newMessage = this.ChatRepository.create(createChatDto);
    // console.log('createCommonChatSessionDto', createCommonChatSessionDto);
    // console.log('new message', newMessage);
    // newMessage.author = this.clientToUser[user];
    await this.ChatRepository.save(newMessage);
    return newMessage;
  }
  async findAll(): Promise<any[]> {
    const chats = await this.ChatRepository.find({
      relations: ['parent', 'author'],
    });
    // console.log("chats", chats);
    const chatsWithAuthorDetails = chats.map((chat) => {
      return {
        ...chat,
        author: {
          username: chat.author.username,
          role: chat.author.role,
          id: chat.author.id,
        },
      };
    });
    // console.log('chatsWithAuthorDetails', chatsWithAuthorDetails);
    return this.organizeMessages(chatsWithAuthorDetails);
  }
  async deleteMessage(id: number) {
    const messages = await this.findAll();
    const messageToDelete = this.findMessageById(messages, id);
    if (messageToDelete) {
      await this.ChatRepository.softRemove(messageToDelete);
    } else {
      throw new NotFoundException(`Message with id ${id} not found.`);
    }
  }
}
