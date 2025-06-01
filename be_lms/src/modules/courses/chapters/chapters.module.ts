import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChaptersService } from './chapters.service';
import { ChaptersController } from './chapters.controller';
import { Chapter } from './chapters.entity';
import { Course } from '../courses.entity';
import { Lecture } from './lectures/lectures.entity';
import { QuizSQL } from './quizSQL/quizSQL.entity';
import { LessonProgress } from 'src/modules/registrations/lesson-progress/lesson-progress.entity';
import { CourseRegistration } from 'src/modules/registrations/course-registrations.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chapter, Course, Lecture, QuizSQL, LessonProgress, CourseRegistration])],
  providers: [ChaptersService],
  controllers: [ChaptersController],
  exports: [ChaptersService]
})
export class ChaptersModule {}
