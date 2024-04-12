import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CV } from '../../cv/entities/cv.entity';
import { TimestampEntities } from '../../Generics/timestamp.entities';

@Entity('user')
export class User extends TimestampEntities {
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

  @Column({
    length: 50,
  })
  password: string;

  @OneToMany(() => CV, (cv) => cv.user, {
    nullable: true,
    cascade: true,
  })
  cvs: CV[];
}
