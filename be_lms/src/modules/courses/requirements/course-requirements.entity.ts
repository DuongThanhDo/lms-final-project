import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Course } from '../courses.entity';

@Entity('course_requirements')
export class CourseRequirement {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Course, (course) => course.requirements, { onDelete: 'CASCADE' })
  course: Course;

  @Column('text')
  description: string;
}