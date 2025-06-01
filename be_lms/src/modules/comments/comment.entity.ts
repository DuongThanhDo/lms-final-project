import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
import { User } from '../users/user.entity';
import { CommentableType } from 'src/common/constants/enum';
  
  @Entity('comments')
  export class Comment {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: 'text' })
    content: string;
  
    @Column({ type: 'enum', enum: CommentableType })
    commentable_type: CommentableType;
  
    @Column()
    commentable_id: number;
  
    @Column({ nullable: true })
    parent_id: number;
  
    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;
  
    @Column()
    user_id: number;
  
    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;
  }
  