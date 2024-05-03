import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TimestampEntities } from '../../Generics/timestamp.entities';
import { User } from '../../user/entities/user.entity';
import { ChatEntity } from './chat.entity';
@Entity('like')
export class LikeEntity extends TimestampEntities {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => User, {
    nullable: false,
  })
  owner: User;
  @ManyToOne(() => ChatEntity, {
    nullable: false,
  })
  message: ChatEntity;
}
