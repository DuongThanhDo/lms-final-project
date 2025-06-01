import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Course } from '../courses.entity';

@Entity('course_outcomes')
export class CourseOutcome {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Course, (course) => course.outcomes, { onDelete: 'CASCADE' })
  course: Course;

  @Column('text')
  description: string;
}