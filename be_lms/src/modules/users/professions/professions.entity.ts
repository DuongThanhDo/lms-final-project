import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../user.entity';

@Entity('professions')
export class Profession  {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.profession, { cascade: true })
  @JoinColumn()
  user: User;

  @Column({ length: 255, nullable: true })
  major: string;
  
  @Column({ length: 255, nullable: true })
  level: string;

  @Column({ type: 'text', nullable: true })
  bio: string;
}