import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Chapter } from '../chapters.entity';
import { Media } from 'src/modules/medias/media.entity';

@Entity('lectures')
export class Lecture {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @ManyToOne(() => Chapter, (chapter) => chapter.lectures, {
    onDelete: 'CASCADE',
  })
  chapter: Chapter;

  @OneToOne(() => Media, (media) => media.lecture)
  @JoinColumn({ name: 'video_url' })
  video: Media | null;

  @Column({ type: 'int' })
  order: number;

  @Column({ type: 'int', nullable: true, default: 0 })
  duration: number;

  @Column({ type: 'text', nullable: true })
  description?: string;
}
