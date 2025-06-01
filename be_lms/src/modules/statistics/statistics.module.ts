import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Course } from '../courses/courses.entity';
import { Payment } from '../payments/payment.entity';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { CourseRegistration } from '../registrations/course-registrations.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Course, Payment, CourseRegistration])],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
