import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  name: string;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}