import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { User } from '../users/user.entity';
import { CourseStatus, CourseType } from 'src/common/constants/enum';
import { Chapter } from './chapters/chapters.entity';
import { Media } from '../medias/media.entity';
import { Category } from '../central_information/categories/category.entity';
import { CourseOutcome } from './outcomes/course-outcomes.entity';
import { CourseRequirement } from './requirements/course-requirements.entity';
import { CourseRegistration } from '../registrations/course-registrations.entity';
import { Payment } from '../payments/payment.entity';
import { Certificate } from '../central_information/certificates/certificate.entity';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.courses, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'teacher_id' })
  teacher: User;

  @OneToMany(() => Chapter, (chapter) => chapter.course, { cascade: true })
  chapters: Chapter[];

  @OneToMany(() => CourseOutcome, (c) => c.course, { cascade: true })
  outcomes: CourseOutcome[];

  @OneToMany(() => CourseRequirement, (c) => c.course, { cascade: true })
  requirements: CourseRequirement[];

  @OneToMany(() => CourseRegistration, (course) => course.user)
  courseRegistrations: CourseRegistration[];

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;
  
  @Column({ type: 'text', nullable: true })
  rejectionReason: string;

  @ManyToOne(() => Category, (category) => category.courses, {
    onDelete: 'SET NULL',
    eager: true,
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  price: number;

  @Column({ type: 'enum', enum: CourseType })
  type: CourseType;

  @OneToOne(() => Media, (media) => media.course)
  @JoinColumn({ name: 'image' })
  image: Media | null;

  @ManyToOne(() => Certificate, (c) => c.courses)
  @JoinColumn({ name: 'certificate' })
  certificate: Certificate | null;

  @Column({ type: 'enum', enum: CourseStatus, default: CourseStatus.DRAFT })
  status: CourseStatus;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    update: false,
  })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
