import { StatusPayment } from 'src/common/constants/enum';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { Course } from '../courses/courses.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (p) => p.payments)
  user: User | null;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: StatusPayment,
    default: StatusPayment.PENDING,
  })
  status: StatusPayment;

  @Column()
  vnp_txn_ref: string;

  @Column({ nullable: true })
  vnp_response_code: string;

  @Column({ nullable: true })
  vnp_secure_hash: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  updated_at: Date;
}
