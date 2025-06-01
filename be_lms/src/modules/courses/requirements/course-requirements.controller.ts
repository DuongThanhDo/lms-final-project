import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';
import { CourseRequirementsService } from './course-requirements.service';
import { CreateCourseRequirementDto, UpdateCourseRequirementDto } from './course-requirements.dto';

@Controller('course-requirements')
export class CourseRequirementsController {
  constructor(private readonly courseRequirementsService: CourseRequirementsService) {}

  @Post()
  create(@Body() dto: CreateCourseRequirementDto) {
    return this.courseRequirementsService.create(dto);
  }

  @Get()
  findAll(@Query('courseId') courseId: number) {
    return this.courseRequirementsService.findAll(courseId);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateCourseRequirementDto) {
    return this.courseRequirementsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.courseRequirementsService.remove(id);
  }
}