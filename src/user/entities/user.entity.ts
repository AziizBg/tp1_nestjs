import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CV } from '../../cv/entities/cv.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 50,
    unique: true,
  })
  username: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: number;

  @OneToMany((type) => CV, (cv) => cv.user, {
    nullable: true,
    cascade: true,
  })
  cvs: CV[];
}
