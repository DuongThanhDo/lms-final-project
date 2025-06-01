import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LessonProgress } from './lesson-progress.entity';
import { CourseRegistration } from '../course-registrations.entity';
import {
  CreateLessonProgressDto,
  UpdateLessonProgressDto,
} from './lesson-progress.dto';

@Injectable()
export class LessonProgressesService {
  constructor(
    @InjectRepository(LessonProgress)
    private readonly lessonProgressRepository: Repository<LessonProgress>,

    @InjectRepository(CourseRegistration)
    private readonly courseRegistrationRepository: Repository<CourseRegistration>,
  ) {}

  async create(dto: CreateLessonProgressDto) {
    const progress = this.lessonProgressRepository.create(dto);
    return this.lessonProgressRepository.save(progress);
  }

  async findAll() {
    return this.lessonProgressRepository.find();
  }

  async findOne(id: number) {
    const progress = await this.lessonProgressRepository.findOne({
      where: { id },
    });
    if (!progress) throw new NotFoundException('Lesson progress not found');
    return progress;
  }

  async findOneByUser(lesson_id: number, user_id: number) {
    const progress = await this.lessonProgressRepository.findOne({
      where: {
        user: { id: user_id },
        lesson_id: lesson_id,
      },
    });
    if (!progress) throw new NotFoundException('Lesson progress not found');
    return progress;
  }

  async updateStatus(id: number, dto: UpdateLessonProgressDto) {
    const { score, status } = dto;
    const progress = await this.lessonProgressRepository.findOne({
      where: { id },
      relations: ['courseRegistration'],
    });
    if (!progress) throw new NotFoundException('Lesson progress not found');

    if (status !== undefined) {
      progress.status = status;
      progress.progress = status ? 1 : 0;
    }
    if (score !== undefined) progress.score = score;
    progress.updatedAt = new Date();

    if (status) progress.progress = 1;

    await this.lessonProgressRepository.save(progress);

    const registration = progress.courseRegistration;
    const allProgresses = await this.lessonProgressRepository.find({
      where: { courseRegistration: { id: registration.id } },
    });

    const completed = allProgresses.filter((p) => p.progress >= 1).length;
    const total = allProgresses.length;
    registration.progress = total > 0 ? (completed / total) * 100 : 0;
    registration.updatedAt = new Date();

    await this.courseRegistrationRepository.save(registration);

    return progress;
  }

  async remove(id: number) {
    return this.lessonProgressRepository.delete(id);
  }
}
