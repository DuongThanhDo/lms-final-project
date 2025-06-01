import { IsInt, IsString, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateQuizSQLDto {
  @IsInt()
  order: number;
  
  @IsString()
  name: string;

  @IsInt()
  chapterId: number;
}

export class UpdateQuizSQLDto extends PartialType(CreateQuizSQLDto) {}