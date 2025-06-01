import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { Course } from '../courses/courses.entity';
import { LessonProgress } from './lesson-progress/lesson-progress.entity';

@Entity('course_registrations')
export class CourseRegistration {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.courseRegistrations, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Course, (course) => course.courseRegistrations, { onDelete: 'CASCADE' })
  course: Course;

  @Column({ type: 'float', default: 0 })
  progress: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => LessonProgress, (l) => l.courseRegistration, { cascade: true })
  lessonProgresses: LessonProgress[];
}
