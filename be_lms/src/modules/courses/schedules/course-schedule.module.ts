import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseSchedule } from './course-schedule.entity';
import { CourseScheduleService } from './course-schedule.service';
import { CourseScheduleController } from './course-schedule.controller';
import { Course } from '../courses.entity';
import { Room } from 'src/modules/central_information/rooms/room.entity';
import { User } from 'src/modules/users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CourseSchedule, Course, Room, User]),
  ],
  controllers: [CourseScheduleController],
  providers: [CourseScheduleService],
})
export class CourseScheduleModule {}
