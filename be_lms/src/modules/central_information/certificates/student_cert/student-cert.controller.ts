import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { StudentCertService } from './student-cert.service';
import { CreateStudentCertDto } from './create-student-cert.dto';

@Controller('student-cert')
export class StudentCertController {
  constructor(private readonly studentCertService: StudentCertService) {}

  @Post()
  create(@Body() dto: CreateStudentCertDto) {
    return this.studentCertService.create(dto);
  }

  @Get()
  findAll() {
    return this.studentCertService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentCertService.findOne(+id);
  }
}
