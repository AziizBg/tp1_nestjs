// history.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntities } from 'src/Generics/timestamp.entities';
import { CvEvents } from 'src/cv/cv.events';

@Entity()
export class History extends TimestampEntities{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  operationType: CvEvents;

  @Column()
  cvId: number;

  @Column()
  userId: number;
}
