import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './courses.entity';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { User } from '../users/user.entity';
import { Media } from '../medias/media.entity';
import { MediaModule } from '../medias/medias.module';
import { Category } from '../central_information/categories/category.entity';
import { CourseOutcomesModule } from './outcomes/course-outcomes.module';
import { CourseRequirementsModule } from './requirements/course-requirements.module';
import { ChaptersModule } from './chapters/chapters.module';
import { Certificate } from '../central_information/certificates/certificate.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course, User, Media, Category, Certificate]),
    MediaModule,
    CourseOutcomesModule,
    CourseRequirementsModule,
    ChaptersModule,
  ],
  providers: [CoursesService],
  controllers: [CoursesController],
  exports: [CoursesService],
})
export class CoursesModule {}
