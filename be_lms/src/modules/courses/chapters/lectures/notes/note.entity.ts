import { User } from 'src/modules/users/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Lecture } from '../lectures.entity';
import { Course } from 'src/modules/courses/courses.entity';


@Entity('notes')
export class Note {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column('bigint')
  timestamp: number;

  @CreateDateColumn()
  created_at: Date;
  
  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Course)
  course: Course;

  @ManyToOne(() => Lecture)
  lecture: Lecture;

  @ManyToOne(() => User)
  student: User;
}