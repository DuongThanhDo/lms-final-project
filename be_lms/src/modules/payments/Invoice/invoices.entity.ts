import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';
import { Payment } from '../payment.entity';
import { Course } from 'src/modules/courses/courses.entity';
import { StatusPayment } from 'src/common/constants/enum';
import { User } from 'src/modules/users/user.entity';

@Entity({ name: 'invoices' })
export class Invoice {
  @PrimaryColumn({ type: 'nvarchar', length: 255 })
  invoice_code!: string;

  @Column({ type: 'int' })
  amount!: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  invoice_date!: Date;

  @Column({ type: 'timestamp', nullable: true })
  due_date!: Date;

  @Column({
    type: 'enum',
    enum: StatusPayment,
    default: StatusPayment.PENDING,
  })
  status: StatusPayment;

  @Column({ type: 'varchar', length: 255, nullable: true })
  message_log!: string;

  @OneToOne(() => Payment, { cascade: true })
  @JoinColumn({ name: 'payment_id' })
  payment!: Payment;

  @ManyToOne(() => Course, { cascade: true })
  @JoinColumn({ name: 'course_id' })
  course: Course | null;

  @ManyToOne(() => User, { cascade: true })
  @JoinColumn({ name: 'user_id' })
  user: User | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
