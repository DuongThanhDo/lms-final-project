import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseRequirement } from './course-requirements.entity';
import { CreateCourseRequirementDto, UpdateCourseRequirementDto } from './course-requirements.dto';

@Injectable()
export class CourseRequirementsService {
  constructor(
    @InjectRepository(CourseRequirement)
    private readonly courseRequirementsRepository: Repository<CourseRequirement>,
  ) {}

  async create(dto: CreateCourseRequirementDto) {
    const requirement = this.courseRequirementsRepository.create({ course: { id: dto.courseId }, description: dto.description });
    return await this.courseRequirementsRepository.save(requirement);
  }

  async findAll(courseId: number) {
    return await this.courseRequirementsRepository.find({
      where: { course: { id: courseId } },
      relations: ['course'],
      loadRelationIds: true,
    });
  }

  async update(id: number, dto: UpdateCourseRequirementDto) {
    await this.courseRequirementsRepository.update(id, dto);
    return this.courseRequirementsRepository.findOne({ where: { id } });
  }

  async remove(id: number) {
    return await this.courseRequirementsRepository.delete(id);
  }
}