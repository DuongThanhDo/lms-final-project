import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseSchedule } from './course-schedule.entity';
import { Course } from '../courses.entity';
import { Room } from 'src/modules/central_information/rooms/room.entity';
import { User } from 'src/modules/users/user.entity';  // Import User entity
import { CreateCourseScheduleDto, UpdateCourseScheduleDto } from './course-schedule.dto';

@Injectable()
export class CourseScheduleService {
  constructor(
    @InjectRepository(CourseSchedule)
    private readonly scheduleRepo: Repository<CourseSchedule>,

    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,

    @InjectRepository(Room)
    private readonly roomRepo: Repository<Room>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(dto: CreateCourseScheduleDto) {
    const course = dto.course_id ? await this.courseRepo.findOne({where:{ id: dto.course_id }}) : null;
    const room = dto.room_id ? await this.roomRepo.findOne({where:{ id: dto.room_id }}) : null;
    const user = await this.userRepo.findOne({where:{ id: dto.user_id }});

    if(!user) throw new Error('Không có người dùng!');

    const schedule = this.scheduleRepo.create({
      ...dto,
      start_time: new Date(dto.start_time),
      end_time: new Date(dto.end_time),
      course,
      room,
      user,
    });

    return this.scheduleRepo.save(schedule);
  }

  async update(id: number, dto: UpdateCourseScheduleDto) {
    if (!dto.start_time || !dto.end_time) {
      throw new Error("Start time and end time must be provided");
    }

    const schedule = await this.scheduleRepo.findOneByOrFail({ id }).catch(() => {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    });

    const course = dto.course_id ? await this.courseRepo.findOne({where:{ id: dto.course_id }}) : null;

    Object.assign(schedule, {
      ...dto,
      start_time: new Date(dto.start_time),
      end_time: new Date(dto.end_time),
      course: course ? course : schedule.course
    });

    return this.scheduleRepo.save(schedule);
  }

  async findAllByUser(userId: number) {
    return await this.scheduleRepo.find({ where: {user: { id: userId }}, relations: ['course', 'room', 'user'] });
  }

  async findOne(id: number) {
    return await this.scheduleRepo.findOne({ where: { id }, relations: ['course', 'room', 'user'] });
  }

  async remove(id: number) {
    const schedule = await this.scheduleRepo.findOneByOrFail({ id });
    return this.scheduleRepo.remove(schedule);
  }
}
