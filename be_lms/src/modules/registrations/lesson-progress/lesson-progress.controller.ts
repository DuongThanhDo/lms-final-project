import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateLessonProgressDto, UpdateLessonProgressDto } from './lesson-progress.dto';
import { LessonProgressesService } from './lesson-progress.service';

@Controller('lesson-progresses')
export class LessonProgressesController {
  constructor(private readonly lessonProgressesService: LessonProgressesService) {}

  @Post()
  create(@Body() dto: CreateLessonProgressDto) {
    return this.lessonProgressesService.create(dto);
  }

  @Get()
  findAll() {
    return this.lessonProgressesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lessonProgressesService.findOne(+id);
  }

  @Get(':lesson_id/user/:user_id')
  findOneByUser(@Param('lesson_id') lesson_id: string, @Param('user_id') user_id: string) {
    return this.lessonProgressesService.findOneByUser(+lesson_id, +user_id);
  }

  @Patch(':id')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateLessonProgressDto) {
    return this.lessonProgressesService.updateStatus(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lessonProgressesService.remove(+id);
  }
}
