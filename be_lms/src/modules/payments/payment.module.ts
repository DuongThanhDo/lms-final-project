import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Payment } from './payment.entity';
import { Course } from '../courses/courses.entity';
import { User } from '../users/user.entity';
import { VNPaymentModule } from './vnpay/vnpay.module';
import { Invoice } from './Invoice/invoices.entity';
import { CourseRegistrationsModule } from '../registrations/course-registrations.module';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Course, User, Invoice]), ConfigModule, VNPaymentModule, CourseRegistrationsModule],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
