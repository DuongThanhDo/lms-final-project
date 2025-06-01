import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CourseRequirement } from "./course-requirements.entity";
import { CourseRequirementsController } from "./course-requirements.controller";
import { CourseRequirementsService } from "./course-requirements.service";

@Module({
  imports: [TypeOrmModule.forFeature([CourseRequirement])],
  controllers: [CourseRequirementsController],
  providers: [CourseRequirementsService],
  exports: [CourseRequirementsService],
})
export class CourseRequirementsModule {}