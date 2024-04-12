import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Skill } from '../../skill/entities/skill.entity';
import { User } from '../../user/entities/user.entity';

@Entity('cv')
export class CV {
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

  @Column()
  path: string;

  @ManyToMany((type) => Skill, (skill) => skill.cvs, {
    nullable: true,
    cascade: true,
    eager: true,
  })
  skills: Skill[];

  @ManyToOne((type) => User, (user) => user.cvs, {
    nullable: false,
    cascade: ['insert', 'update'],
    eager: true,
  })
  user: User;
}
