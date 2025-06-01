import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CourseRegistrationsService } from './course-registrations.service';
import { CreateCourseRegistrationDto } from './create-course-registration.dto';

@Controller('course-registrations')
export class CourseRegistrationsController {
  constructor(private readonly courseRegistrationService: CourseRegistrationsService) {}

  @Post()
  create(@Body() dto: CreateCourseRegistrationDto) {
    return this.courseRegistrationService.create(dto);
  }

  @Get('/student/:userId')
  findAllByStudent(@Param('userId') userId: string) {
    return this.courseRegistrationService.findAllByStudent(+userId);
  }

  @Post('check-purchased')
  async checkPurchased(@Body() dto: CreateCourseRegistrationDto) {
    const isPurchased = await this.courseRegistrationService.checkPurchased(dto);
    return { isPurchased };
  }

  @Get('/students/:courseId')
  getStudentsByCourse(@Param('courseId') courseId: string) {
    return this.courseRegistrationService.findStudentsByCourse(+courseId);
  }

  @Get('/get-one')
  findOneByStudent(@Query() dto: CreateCourseRegistrationDto) {
    return this.courseRegistrationService.findOneByStudent(dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courseRegistrationService.remove(+id);
  }
}
