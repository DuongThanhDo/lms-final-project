import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  Query,
  Patch,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto, FindTopCoursesByCondition, SearchCourse, SearchCourseForStudent, UpdateCourseDto } from './courses.dto';
import { Course } from './courses.entity';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  findAll(): Promise<Course[]> {
    return this.coursesService.findAll();
  }

  @Get('search')
  searchCourses(@Query() dto: SearchCourse): Promise<any[]> {
    return this.coursesService.searchCourses(dto);
  }

  @Get('student')
  findAllForStudent(@Query() dto: SearchCourseForStudent): Promise<{ data: any[]; total: number }> {
    return this.coursesService.findAllForStudent(dto);
  }

  @Get('top-courses')
  findTopCoursesByCondition(@Query() dto: FindTopCoursesByCondition): Promise<any[]> {
    return this.coursesService.findTopCoursesByCondition(dto);
  }

  @Get('all-info/:id')
  findAllInfoCourse(@Param('id') id: number): Promise<any[]> {
    return this.coursesService.findAllInfoCourse(id);
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Course> {
    return this.coursesService.findOne(id);
  }

  @Post()
  create(@Body() createCourseDto: CreateCourseDto): Promise<number> {
    return this.coursesService.create(createCourseDto);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateCourseDto: UpdateCourseDto,
  ): Promise<Course> {
    return this.coursesService.update(id, updateCourseDto);
  }

  @Patch(':id/reject')
  rejectCourse(
    @Param('id') id: number,
    @Body('reason') reason: string,
  ) {
    return this.coursesService.rejectCourse(+id, reason);
  }

  @Put('/upload/:id')
  @UseInterceptors(FileInterceptor('file'))
  updateCourseImage(
    @Param('id') id: string,
    @UploadedFile() file: any,
  ): Promise<Course> {
    return this.coursesService.updateCourseImage(parseInt(id), file);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<boolean> {
    return this.coursesService.remove(id);
  }
}
