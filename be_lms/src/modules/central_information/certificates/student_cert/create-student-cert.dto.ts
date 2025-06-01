import { IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateStudentCertDto {
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  studentId: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  courseId: number;

  @IsNotEmpty()
  formBuilt: any;
}

