import { Course } from 'src/modules/courses/courses.entity';
import { Lecture } from '../lectures.entity';
import { Note } from './note.entity';
import { Module } from "@nestjs/common";
import { NoteService } from './notes.service';
import { NoteController } from './notes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/modules/users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Note, Lecture, Course, User])],
  providers: [NoteService],
  controllers: [NoteController],
})
export class NoteModule {}