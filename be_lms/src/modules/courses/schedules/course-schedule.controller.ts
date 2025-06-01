import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { CourseScheduleService } from './course-schedule.service';
import { CreateCourseScheduleDto, UpdateCourseScheduleDto } from './course-schedule.dto';

@Controller('course-schedules')
export class CourseScheduleController {
  constructor(private readonly courseScheduleService: CourseScheduleService) {}

  @Post()
  create(@Body() dto: CreateCourseScheduleDto) {
    return this.courseScheduleService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCourseScheduleDto) {
    return this.courseScheduleService.update(+id, dto);
  }

  @Get('user/:id')
  findAllByUser(@Param('id') id: string) {
    return this.courseScheduleService.findAllByUser(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courseScheduleService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courseScheduleService.remove(+id);
  }
}
