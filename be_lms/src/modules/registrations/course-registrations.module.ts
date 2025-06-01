import { LessonProgress } from './lesson-progress/lesson-progress.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseRegistrationsService } from './course-registrations.service';
import { CourseRegistrationsController } from './course-registrations.controller';
import { CourseRegistration } from './course-registrations.entity';
import { User } from '../users/user.entity';
import { Course } from '../courses/courses.entity';
import { Chapter } from '../courses/chapters/chapters.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CourseRegistration, User, Course, Chapter, LessonProgress])],
  controllers: [CourseRegistrationsController],
  providers: [CourseRegistrationsService],
  exports: [CourseRegistrationsService, CourseRegistrationsModule],
})
export class CourseRegistrationsModule {}
