import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Chapter } from '../chapters.entity';

@Entity()
export class QuizSQL {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quizFB_id: string;

  @Column()
  order: number;

  @Column()
  name: string;

  @ManyToOne(() => Chapter, (chapter) => chapter.quizzes, {
    onDelete: 'CASCADE',
  })
  chapter: Chapter;
}
