import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CV } from '../../cv/entities/cv.entity';

@Entity('skill')
export class Skill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 50,
  })
  Designation: string;

  @ManyToMany(() => Skill, (skill) => skill.cvs, {
    nullable: true,
    cascade: ['insert', 'update'],
  })
  cvs: CV[];
}
