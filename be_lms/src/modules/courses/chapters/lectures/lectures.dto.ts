import { IsNotEmpty, IsInt, IsString, IsUrl, IsOptional } from 'class-validator';

export class CreateLectureDto {
  @IsNotEmpty()
  @IsInt()
  chapterId: number;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsInt()
  order: number;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateLectureDto {
  @IsString()
  title?: string;

  @IsString()
  description?: string;
}
