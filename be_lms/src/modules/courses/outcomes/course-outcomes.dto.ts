import { IsInt, IsString, MinLength } from "class-validator";

export class CreateCourseOutcomeDto {
  @IsInt()
  courseId: number;

  @IsString()
  @MinLength(1)
  description: string;
}

export class UpdateCourseOutcomeDto {
  @IsString()
  @MinLength(1)
  description?: string;
}
