import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateNoteDto {
  @IsInt()
  @Type(() => Number)
  course_id: number;

  @IsInt()
  @Type(() => Number)
  lecture_id: number;

  @IsInt()
  @Type(() => Number)
  student_id: number;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsInt()
  @Type(() => Number)
  timestamp: number;
}

export class UpdateNoteDto extends PartialType(CreateNoteDto) {}

export class FindAllByStudent {
  @IsInt()
  @Type(() => Number)
  course_id: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  student_id?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  lecture_id?: number;
}
