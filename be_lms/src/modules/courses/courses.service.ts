import { Chapter } from './chapters/chapters.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateCourseDto,
  FindTopCoursesByCondition,
  SearchCourse,
  SearchCourseForStudent,
  UpdateCourseDto,
} from './courses.dto';
import { Course } from './courses.entity';
import { User } from '../users/user.entity';
import { MediaService } from '../medias/medias.service';
import { Category } from '../central_information/categories/category.entity';
import { ChaptersService } from './chapters/chapters.service';
import { CourseOutcomesService } from './outcomes/course-outcomes.service';
import { CourseRequirementsService } from './requirements/course-requirements.service';
import { CourseStatus, CourseType } from 'src/common/constants/enum';
import { Certificate } from '../central_information/certificates/certificate.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Certificate)
    private certificateRepository: Repository<Certificate>,
    private readonly mediaService: MediaService,
    private readonly chapterService: ChaptersService,
    private readonly outcomeService: CourseOutcomesService,
    private readonly requirementService: CourseRequirementsService,
  ) {}

  async findAll(): Promise<Course[]> {
    return this.courseRepository.find();
  }

  async findOne(id: number): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['category', 'image', 'certificate'],
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    return course;
  }

  async searchCourses(dto: SearchCourse): Promise<any[]> {
    const queryBuilder = this.courseRepository
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.category', 'category')
      .leftJoinAndSelect('course.teacher', 'user')
      .leftJoinAndSelect('user.profile', 'profile')
      .leftJoinAndSelect('course.image', 'image');

    if (dto.teacherId) {
      queryBuilder.where('course.teacher_id = :teacherId', {
        teacherId: dto.teacherId,
      });
    }

    if (dto.searchValue) {
      queryBuilder.andWhere(
        '(course.name LIKE :search OR course.description LIKE :search)',
        { search: `%${dto.searchValue}%` },
      );
    }

    if (dto.category) {
      queryBuilder.andWhere('course.category_id = :category', {
        category: dto.category,
      });
    }

    if (dto.type) {
      queryBuilder.andWhere('course.type = :type', { type: dto.type });
    }

    if (dto.status) {
      queryBuilder.andWhere('course.status = :status', { status: dto.status });
    }

    queryBuilder.orderBy('course.updated_at', 'DESC');

    const courses = await queryBuilder.getMany();

    return courses.map((course) => ({
      id: course.id,
      teacher_name: course.teacher?.profile?.name,
      name: course.name,
      description: course.description,
      category: course.category?.name,
      price: course.price,
      type: course.type,
      image: course.image,
      status: course.status,
      rejectionReason: course.rejectionReason,
      created_at: course.created_at,
      updated_at: course.updated_at,
    }));
  }

  async findAllForStudent(
    dto: SearchCourseForStudent,
  ): Promise<{ data: any[]; total: number }> {
    const { searchValue, category, type, sort, page = 1, limit = 12 } = dto;

    const queryBuilder = this.courseRepository
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.category', 'category')
      .leftJoinAndSelect('course.image', 'image')
      .leftJoinAndSelect('course.teacher', 'teacher')
      .leftJoinAndSelect('teacher.profile', 'profile')
      .where('course.status = :status', { status: CourseStatus.PUBLISHED });

    if (searchValue) {
      queryBuilder.andWhere(
        '(course.name LIKE :search OR course.description LIKE :search)',
        { search: `%${searchValue}%` },
      );
    }

    if (category) {
      queryBuilder.andWhere('course.category_id = :category', { category });
    }

    if (type) {
      queryBuilder.andWhere('course.type = :type', { type });
    }

    switch (sort) {
      case 'newest':
        queryBuilder.orderBy('course.created_at', 'DESC');
        break;
      case 'priceLow':
        queryBuilder.orderBy('course.price', 'ASC');
        break;
      case 'priceHigh':
        queryBuilder.orderBy('course.price', 'DESC');
        break;
      default:
        queryBuilder.orderBy('course.updated_at', 'DESC');
        break;
    }

    const total = await queryBuilder.getCount();

    queryBuilder.skip((page - 1) * limit).take(limit);

    const courses = await queryBuilder.getMany();

    const data = courses.map((course) => ({
      id: course.id,
      name: course.name,
      description: course.description,
      category: course.category?.name,
      type: course.type,
      image: course.image,
      price: course.price,
      teacher: course.teacher,
      created_at: course.created_at,
      updated_at: course.updated_at,
    }));

    return { data, total };
  }

  async findAllInfoCourse(courseId: number): Promise<any> {
    const [course, outcomes, requirements] = await Promise.all([
      this.findOne(courseId),
      this.outcomeService.findAll(courseId),
      this.requirementService.findAll(courseId),
    ]);

    let contents: any[] = [];
    if (course.type === CourseType.ONLINE) {
      contents = await this.chapterService.getChaptersWithContent(courseId);
    }

    return {
      course,
      outcomes,
      requirements,
      contents,
    };
  }

  async create(dto: CreateCourseDto): Promise<number> {
    const teacher = await this.userRepository.findOne({
      where: { id: dto.teacherId },
    });
    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${dto.teacherId} not found`);
    }

    const newCourse = this.courseRepository.create({
      name: dto.name,
      type: dto.type,
      status: dto.status,
      teacher,
    });

    const course = await this.courseRepository.save(newCourse);
    return course.id;
  }

  async update(id: number, dto: UpdateCourseDto): Promise<Course> {
    const category = await this.categoryRepository.findOne({
      where: { id: dto.category },
    });
    const certificate = await this.certificateRepository.findOne({
      where: { id: dto.certificate },
    });
    const course = await this.findOne(id);
    Object.assign(course, { ...dto, category, certificate });
    return this.courseRepository.save(course);
  }

  async rejectCourse(id: number, reason: string) {
    const course = await this.courseRepository.findOne({ where: { id } });
    if (!course) throw new NotFoundException('Khóa học không tồn tại');

    course.status = CourseStatus.REJECTED;
    course.rejectionReason = reason;

    return this.courseRepository.save(course);
  }

  async updateCourseImage(id: number, file: any): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['image'],
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.image) {
      const imageId = course.image.id;
      course.image = null;
      await this.courseRepository.save(course);
      await this.mediaService.deleteFile(imageId);
    }

    const media = await this.mediaService.uploadFile(file);
    course.image = media;
    return this.courseRepository.save(course);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.courseRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return true;
  }

  async findTopCoursesByCondition(
    dto: FindTopCoursesByCondition,
  ): Promise<any[]> {
    const { category, teacherId, isFree, limit = 4 } = dto;

    const queryBuilder = this.courseRepository
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.category', 'category')
      .leftJoinAndSelect('course.image', 'image')
      .leftJoinAndSelect('course.teacher', 'teacher')
      .leftJoinAndSelect('teacher.profile', 'profile')
      .where('course.status = :status', { status: CourseStatus.PUBLISHED })
      .orderBy('course.updated_at', 'DESC')
      .limit(limit);

    if (category) {
      queryBuilder.andWhere('course.category_id = :category', { category });
    }

    if (teacherId) {
      queryBuilder.andWhere('course.teacher_id = :teacherId', { teacherId });
    }

    if (isFree) {
      queryBuilder.andWhere('course.price = 0');
    }

    const courses = await queryBuilder.getMany();

    return courses.map((course) => ({
      id: course.id,
      teacher: course.teacher,
      name: course.name,
      description: course.description,
      category: course.category?.name,
      price: course.price,
      type: course.type,
      image: course.image,
      status: course.status,
      created_at: course.created_at,
      updated_at: course.updated_at,
    }));
  }
}
