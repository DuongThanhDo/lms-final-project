import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './note.entity';
import { User } from 'src/modules/users/user.entity';
import { Course } from 'src/modules/courses/courses.entity';
import { Lecture } from '../lectures.entity';
import { CreateNoteDto, FindAllByStudent, UpdateNoteDto } from './notes.dto';


@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepo: Repository<Note>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
    @InjectRepository(Lecture)
    private readonly lectureRepo: Repository<Lecture>,
  ) {}

  async create(dto: CreateNoteDto) {
    const note = new Note();
    note.content = dto.content;
    note.timestamp = dto.timestamp;
    note.student = await this.userRepo.findOneByOrFail({ id: dto.student_id });
    note.course = await this.courseRepo.findOneByOrFail({ id: dto.course_id });
    note.lecture = await this.lectureRepo.findOneByOrFail({ id: dto.lecture_id });

    return this.noteRepo.save(note);
  }

  findAllByStudent(dto: FindAllByStudent) {
    const { course_id, student_id, lecture_id } = dto;
  
    const where: any = {};
    if (course_id) where.course = { id: course_id };
    if (student_id) where.student = { id: student_id };
    if (lecture_id) where.lecture = { id: lecture_id };
  
    return this.noteRepo.find({
      where,
      relations: ['student', 'course', 'lecture'],
    });
  }

  findOne(id: number) {
    return this.noteRepo.findOne({ where: { id }, relations: ['student', 'course', 'lecture'] });
  }

  async update(id: number, dto: UpdateNoteDto) {
    const note = await this.noteRepo.findOneBy({ id });
    if (!note) throw new NotFoundException('Note not found');
    Object.assign(note, dto);
    return this.noteRepo.save(note);
  }

  async remove(id: number) {
    const note = await this.noteRepo.findOneBy({ id });
    if (!note) throw new NotFoundException('Note not found');
    return this.noteRepo.remove(note);
  }
}