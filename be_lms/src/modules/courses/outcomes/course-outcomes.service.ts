import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseOutcome } from './course-outcomes.entity';
import { CreateCourseOutcomeDto, UpdateCourseOutcomeDto } from './course-outcomes.dto';

@Injectable()
export class CourseOutcomesService {
  constructor(
    @InjectRepository(CourseOutcome)
    private readonly courseOutcomesRepository: Repository<CourseOutcome>,
  ) {}

  async create(dto: CreateCourseOutcomeDto) {
    const outcome = this.courseOutcomesRepository.create({ course: { id: dto.courseId }, description: dto.description });
    return await this.courseOutcomesRepository.save(outcome);
  }

  async findAll(courseId: number): Promise<CourseOutcome[]> {
    return await this.courseOutcomesRepository.find({ 
      where: { course: { id: courseId } }, 
      relations: ['course'],
      loadRelationIds: true,
    });
  }

  async update(id: number, dto: UpdateCourseOutcomeDto) {
    await this.courseOutcomesRepository.update(id, dto);
    return this.courseOutcomesRepository.findOne({ where: { id } });
  }

  async remove(id: number) {
    return await this.courseOutcomesRepository.delete(id);
  }
}