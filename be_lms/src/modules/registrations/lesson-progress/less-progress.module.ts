import { Module } from "@nestjs/common";
import { LessonProgress } from "./lesson-progress.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CourseRegistration } from "../course-registrations.entity";
import { LessonProgressesController } from "./lesson-progress.controller";
import { LessonProgressesService } from "./lesson-progress.service";

@Module({
      imports: [TypeOrmModule.forFeature([LessonProgress, CourseRegistration])],
      controllers: [LessonProgressesController],
      providers: [LessonProgressesService],
})

export class LessonProgressesModule {}