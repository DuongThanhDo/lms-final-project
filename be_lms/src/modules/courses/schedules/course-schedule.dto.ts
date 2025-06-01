import { PartialType } from '@nestjs/mapped-types';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator';

export class CreateCourseScheduleDto {
  @IsOptional()
  @IsNumber()
  course_id?: number;

  @IsOptional()
  @IsNumber()
  room_id?: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  start_time: string;

  @IsDateString()
  end_time: string;

  @IsOptional()
  @IsNumber()
  user_id?: number;
}

export class UpdateCourseScheduleDto extends PartialType(
  CreateCourseScheduleDto,
) {}
