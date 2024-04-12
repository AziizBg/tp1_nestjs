import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinTable,
} from 'typeorm';
import { Skill } from '../../skill/entities/skill.entity';
import { User } from '../../user/entities/user.entity';
import { TimestampEntities } from '../../Generics/timestamp.entities';

@Entity('cv')
export class CV extends TimestampEntities {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 50,
  })
  name: string;

  @Column({
    length: 50,
  })
  firstname: string;

  @Column()
  age: number;

  @Column()
  cin: number;

  @Column({
    length: 50,
  })
  job: string;

  @Column({ nullable: true })
  path: string;

  @ManyToMany(() => Skill, (skill) => skill.cvs, {
    nullable: true,
    cascade: true,
    eager: true,
  })
  @JoinTable()
  skills: Skill[];

  @ManyToOne(() => User, (user) => user.cvs, {
    nullable: false,
    cascade: ['insert', 'update'],
    eager: true,
  })
  user: User;
}
