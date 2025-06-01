import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Course } from '../courses/courses.entity';
import { Payment } from '../payments/payment.entity';
import { RevenueByMonthDTO } from './dto/revenue-statistics.dto';
import { CourseStatus, UserRole } from 'src/common/constants/enum';
import { CourseRegistration } from '../registrations/course-registrations.entity';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Course)
    private courseRepository: Repository<Course>,

    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,

    @InjectRepository(CourseRegistration)
    private registrationRepository: Repository<CourseRegistration>,
  ) {}

  // ================== SYSTEM DASHBOARD ==================
  async getSystemOverview() {
    const totalStudents = await this.userRepository.count({
      where: { role: UserRole.STUDENT },
    });
    const totalTeachers = await this.userRepository.count({
      where: { role: UserRole.TEACHER },
    });

    const totalCoursesPublished = await this.courseRepository.count({
      where: { status: CourseStatus.PUBLISHED },
    });
    const totalCoursesPending = await this.courseRepository.count({
      where: { status: CourseStatus.PENDING },
    });

    return {
      totalStudents,
      totalTeachers,
      totalCoursesPublished,
      totalCoursesPending,
    };
  }

  async getMonthlyRevenue(): Promise<RevenueByMonthDTO[]> {
    const year = new Date().getFullYear();
    const result: RevenueByMonthDTO[] = [];

    for (let month = 1; month <= 12; month++) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);

      const totalRevenue = await this.paymentRepository
        .createQueryBuilder('payment')
        .select('SUM(payment.amount)', 'sum')
        .where('payment.created_at BETWEEN :start AND :end', {
          start: startDate,
          end: endDate,
        })
        .getRawOne();

      result.push({
        month,
        revenue: Number(totalRevenue.sum) || 0,
      });
    }

    return result;
  }

  // ================== TEACHER DASHBOARD ==================
  async getTeacherOverview(teacherId: number) {
    const teacherCourses = await this.courseRepository.find({
      where: { teacher: { id: teacherId } },
      select: ['id', 'status'],
    });

    const courseIds = teacherCourses.map((course) => course.id);
    if (courseIds.length === 0) {
      return {
        totalStudents: 0,
        totalCourses: 0,
        publishedCourses: 0,
        pendingCourses: 0,
      };
    }

    const totalStudents = await this.registrationRepository
      .createQueryBuilder('reg')
      .where('reg.courseId IN (:...courseIds)', { courseIds })
      .getCount();

    const totalCourses = teacherCourses.length;
    const publishedCourses = teacherCourses.filter(
      (c) => c.status === CourseStatus.PUBLISHED,
    ).length;
    const pendingCourses = teacherCourses.filter(
      (c) => c.status === CourseStatus.PENDING,
    ).length;

    return {
      totalStudents,
      totalCourses,
      publishedCourses,
      pendingCourses,
    };
  }

  async getTeacherMonthlyRegistrations(
    teacherId: number,
  ): Promise<RevenueByMonthDTO[]> {
    const year = new Date().getFullYear();
    const result: RevenueByMonthDTO[] = [];

    const teacherCourses = await this.courseRepository.find({
      where: { teacher: { id: teacherId } },
      select: ['id'],
    });
    const courseIds = teacherCourses.map((course) => course.id);

    if (courseIds.length === 0) {
      return Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        revenue: 0,
      }));
    }

    for (let month = 1; month <= 12; month++) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);

      const count = await this.registrationRepository
        .createQueryBuilder('reg')
        .where('reg.courseId IN (:...courseIds)', { courseIds })
        .andWhere('reg.createdAt BETWEEN :start AND :end', {
          start: startDate,
          end: endDate,
        })
        .getCount();

      result.push({ month, revenue: count });
    }

    return result;
  }
}
