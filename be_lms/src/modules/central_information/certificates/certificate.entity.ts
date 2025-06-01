import { Course } from 'src/modules/courses/courses.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('certificates')
export class Certificate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({
    type: 'boolean',
    default: false,
  })
  status: boolean;

  @Column({ type: 'json', name: 'form_built', nullable: true })
  formBuilt: any;

  @OneToMany(() => Course, (m) => m.certificate, { cascade: true })
  courses: Course[];
}
