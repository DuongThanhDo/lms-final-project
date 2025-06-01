import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { LessonType } from 'src/common/constants/enum';

export class CreateLessonProgressDto {
  @IsNumber()
  courseRegistrationId: number;

  @IsNumber()
  lessonId: number;

  @IsBoolean()
  status: boolean;

  @IsEnum(LessonType)
  type: LessonType;
}

export class UpdateLessonProgressDto {
  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @IsOptional()
  @IsNumber()
  score?: number;
}