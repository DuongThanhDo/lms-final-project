import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseOutcome } from './course-outcomes.entity';
import { CourseOutcomesService } from './course-outcomes.service';
import { CourseOutcomesController } from './course-outcomes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CourseOutcome])],
  controllers: [CourseOutcomesController],
  providers: [CourseOutcomesService],
  exports: [CourseOutcomesService],
})
export class CourseOutcomesModule {}