import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TimestampEntities } from '../../Generics/timestamp.entities';
import { User } from '../../user/entities/user.entity';
@Entity('chat')
export class ChatEntity extends TimestampEntities {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  content: string;
  @ManyToOne(() => User, {
    nullable: false,
  })
  author: User;
  @ManyToOne(() => ChatEntity, {
    nullable: true,
  })
  parent: ChatEntity;
  @OneToMany(() => ChatEntity, (commonChat) => commonChat.parent, {
    nullable: true,
    cascade: ['soft-remove'],
  })
  replies: ChatEntity[];
}
