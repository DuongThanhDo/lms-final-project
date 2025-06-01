import { Payment } from './../payments/payment.entity';
import { UserRole } from 'src/common/constants/enum';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { UserProfile } from './profiles/profiles.entity';
import { Profession } from './professions/professions.entity';
import { Course } from '../courses/courses.entity';
import { Exclude } from 'class-transformer';
import { CourseRegistration } from '../registrations/course-registrations.entity';
import { LessonProgress } from '../registrations/lesson-progress/lesson-progress.entity';
import { Message } from '../messages/message.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ nullable: true })
  @Exclude()
  password: string;

  @Column({ nullable: true, default: false })
  @Exclude()
  isLock: boolean;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.STUDENT,
  })
  role: UserRole;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  create_at: Date;

  @OneToOne(() => UserProfile, (profile) => profile.user)
  profile: UserProfile;
  
  @OneToOne(() => Profession, (professions) => professions.user)
  profession: Profession;

  @OneToMany(() => Course, (course) => course.teacher)
  courses: Course[];

  @OneToMany(() => Payment, (p) => p.user)
  payments: Payment[];

  @OneToMany(() => CourseRegistration, (course) => course.user)
  courseRegistrations: CourseRegistration[];

  @OneToMany(() => LessonProgress, (u) => u.user)
  lessonProgresses: LessonProgress[];

  @OneToMany(() => Message, (u) => u.sender)
  sentMessages: Message[];
}