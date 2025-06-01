import { IsInt, IsString, MinLength } from 'class-validator';

export class CreateCourseRequirementDto {
  @IsInt()
  courseId: number;

  @IsString()
  @MinLength(1)
  description: string;
}

export class UpdateCourseRequirementDto {
  @IsString()
  @MinLength(1)
  description?: string;
}