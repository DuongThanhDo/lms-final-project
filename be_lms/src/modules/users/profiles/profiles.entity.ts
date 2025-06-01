import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../user.entity';
import { Media } from 'src/modules/medias/media.entity';

@Entity('user_profiles')
export class UserProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.profile, { cascade: true })
  @JoinColumn()
  user: User;

  @Column({ length: 255, nullable: true })
  name: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ type: 'date', nullable: true })
  date_of_birth: Date;

  @Column({ type: 'boolean', nullable: true })
  gender: boolean | null;

  @Column({ length: 255, nullable: true })
  address: string;

  @OneToOne(() => Media, (media) => media.avatar)
  @JoinColumn({ name: 'avatar' })
  avatar: Media | null;
}