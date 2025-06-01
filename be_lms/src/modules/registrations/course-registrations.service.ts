import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseRegistration } from './course-registrations.entity';
import { CreateCourseRegistrationDto } from './create-course-registration.dto';
import { User } from '../users/user.entity';
import { Course } from '../courses/courses.entity';
import { Chapter } from '../courses/chapters/chapters.entity';
import { LessonProgress } from './lesson-progress/lesson-progress.entity';
import { LessonType } from 'src/common/constants/enum';

@Injectable()
export class CourseRegistrationsService {
  constructor(
    @InjectRepository(CourseRegistration)
    private readonly courseRegRepo: Repository<CourseRegistration>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
    @InjectRepository(Chapter)
    private readonly chapterRepo: Repository<Chapter>,
    @InjectRepository(LessonProgress)
    private readonly lessonProgressRepo: Repository<LessonProgress>,
  ) {}

  async create(dto: CreateCourseRegistrationDto) {
    const user = await this.userRepo.findOneByOrFail({ id: dto.userId });
    if (!user) {
      throw new NotFoundException(`User with ID ${dto.userId} not found`);
    }
    const course = await this.courseRepo.findOneByOrFail({ id: dto.courseId });
    if (!course) {
      throw new NotFoundException(`Course with ID ${dto.courseId} not found`);
    }
    const existingRegis = await this.courseRegRepo.findOne({
      where: {
        user: { id: dto.userId },
        course: { id: dto.courseId },
      },
    });

    if (existingRegis) {
      throw new BadRequestException(
        `User ${dto.userId} has already registered for course ${dto.courseId}`,
      );
    }
    const registration = this.courseRegRepo.create({
      user,
      course,
      progress: 0,
    });

    const courseRegis = await this.courseRegRepo.save(registration);

    const chapters = await this.chapterRepo.find({
      where: { course: { id: dto.courseId } },
      relations: ['lectures', 'quizzes'],
    });

    const lessonProgressList: LessonProgress[] = [];

    const pushProgress = (items: any[], type: LessonType) => {
      for (const item of items) {
        lessonProgressList.push(
          this.lessonProgressRepo.create({
            user,
            courseRegistration: courseRegis,
            lesson_id: item.id,
            type,
            status: false,
            progress: 0,
          }),
        );
      }
    };

    for (const chapter of chapters) {
      pushProgress(chapter.lectures || [], LessonType.LECTURE);
      pushProgress(chapter.quizzes || [], LessonType.QUIZ);
      // pushProgress(chapter.codes || [], LessonType.CODE);
    }
    console.log('lessonProgressList:', lessonProgressList);

    await this.lessonProgressRepo.save(lessonProgressList);

    return courseRegis;
  }

  async findStudentsByCourse(courseId: number): Promise<any> {
    const registrations = await this.courseRegRepo.find({
      where: { course: { id: courseId } },
      relations: ['user', 'user.profile'],
    });

    if (!registrations.length) {
      throw new NotFoundException(
        `No students found for course ID ${courseId}`,
      );
    }

    return registrations;
  }

  async findAllByStudent(userId: number) {
    return this.courseRegRepo.find({
      where: { user: { id: userId } },
      relations: ['course', 'course.teacher.profile', 'course.image'],
      order: { updatedAt: 'DESC' },
    });
  }

  async checkPurchased(dto: CreateCourseRegistrationDto) {
    const course = await this.courseRegRepo.findOne({
      where: { user: { id: dto.userId }, course: { id: dto.courseId } },
    });
    return !!course;
  }

  async findOneByStudent(dto: CreateCourseRegistrationDto) {
    const { userId, courseId } = dto;
    const reg = await this.courseRegRepo.findOne({
      where: { user: { id: userId }, course: { id: courseId } },
      relations: ['course'],
    });
    if (!reg) throw new NotFoundException('Registration not found');
    return reg;
  }

  async remove(id: number) {
    const reg = await this.courseRegRepo.findOneBy({ id });
    if (!reg) throw new NotFoundException('Registration not found');
    return this.courseRegRepo.remove(reg);
  }
}
