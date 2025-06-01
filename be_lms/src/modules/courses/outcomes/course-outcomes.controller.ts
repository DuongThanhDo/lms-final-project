import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';
import { CourseOutcomesService } from './course-outcomes.service';
import { CreateCourseOutcomeDto, UpdateCourseOutcomeDto } from './course-outcomes.dto';
import { CourseOutcome } from './course-outcomes.entity';

@Controller('course-outcomes')
export class CourseOutcomesController {
  constructor(private readonly courseOutcomesService: CourseOutcomesService) {}

  @Get()
  findAll(@Query('courseId') courseId: number): Promise<CourseOutcome[]> {
    return this.courseOutcomesService.findAll(courseId);
  }

  @Post()
  create(@Body() dto: CreateCourseOutcomeDto) {
    return this.courseOutcomesService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateCourseOutcomeDto) {
    return this.courseOutcomesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.courseOutcomesService.remove(id);
  }
}