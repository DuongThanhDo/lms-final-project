import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import { CourseRegistration } from '../course-registrations.entity';
  import { LessonType } from 'src/common/constants/enum';
import { User } from 'src/modules/users/user.entity';
  
  @Entity('lesson_progresses')
  export class LessonProgress {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => User, (cr) => cr.lessonProgresses, { onDelete: 'CASCADE' })
    user: User;
  
    @ManyToOne(() => CourseRegistration, (cr) => cr.lessonProgresses, { onDelete: 'CASCADE' })
    courseRegistration: CourseRegistration;
  
    @Column({ type: 'int' })
    lesson_id: number;
  
    @Column({ type: 'boolean', default: false })
    status: boolean;
  
    @Column({ type: 'float', default: 0 })
    progress: number;
  
    @Column({ type: 'float', nullable: true })
    score: number;
  
    @Column({ type: 'enum', enum: LessonType })
    type: LessonType;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }