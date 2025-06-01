import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { CourseStatus, CourseType } from 'src/common/constants/enum';

export class CreateCourseDto {
  @IsNotEmpty()
  @IsNumber()
  teacherId: number;

  @IsOptional()
  @IsNumber()
  certificate: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsEnum(CourseType)
  type: CourseType;

  @IsOptional()
  @IsEnum(CourseStatus)
  status: CourseStatus;
}

export class UpdateCourseDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  certificate?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  category?: number;

  @IsOptional()
  price?: number;

  @IsOptional()
  @IsEnum(CourseStatus)
  status?: CourseStatus;
}

export class SearchCourse {
  @IsOptional()
  @IsString()
  teacherId?: string;

  @IsOptional()
  @IsString()
  searchValue?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsEnum(CourseType)
  type?: CourseType;

  @IsOptional()
  @IsEnum(CourseStatus)
  status?: CourseStatus;
}

export class SearchCourseForStudent {
  @IsOptional()
  @IsString()
  searchValue?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsEnum(CourseType)
  type?: CourseType;

  @IsOptional()
  @IsString()
  sort?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;
}

export class FindTopCoursesByCondition {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  category?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  teacherId?: number;

  @IsOptional()
  isFree?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;
}
