import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentCert } from './student-cert.entity';
import { CreateStudentCertDto } from './create-student-cert.dto';

@Injectable()
export class StudentCertService {
  constructor(
    @InjectRepository(StudentCert)
    private readonly certRepo: Repository<StudentCert>,
  ) {}

  async create(dto: CreateStudentCertDto) {
    const existing = await this.certRepo.findOne({
      where: {
        student: { id: dto.studentId },
        course: { id: dto.courseId },
      },
    });

    if (existing) {
      return false;
    }

    const newCert = this.certRepo.create({
      student: { id: dto.studentId },
      course: { id: dto.courseId },
      formBuilt: dto.formBuilt,
    });

    return this.certRepo.save(newCert);
  }

  findAll() {
    return this.certRepo.find({ relations: ['student', 'course'] });
  }

  findOne(id: number) {
    return this.certRepo.findOne({
      where: { id },
      relations: ['student', 'course'],
    });
  }
}
