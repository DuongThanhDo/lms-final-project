import { Course } from 'src/modules/courses/courses.entity';
import { User } from 'src/modules/users/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity('student_cert')
export class StudentCert {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  student: User;

  @ManyToOne(() => Course, { onDelete: 'CASCADE' })
  course: Course;

  @Column({ type: 'json', name: 'form_built' })
  formBuilt: any;
}
