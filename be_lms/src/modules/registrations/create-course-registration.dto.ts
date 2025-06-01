import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class CreateCourseRegistrationDto {
  @IsNumber()
  @Type(() => Number) 
  userId: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  courseId: number;
}
