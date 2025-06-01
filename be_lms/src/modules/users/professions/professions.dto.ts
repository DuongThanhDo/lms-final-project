import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateProfessionDto {
  @IsNotEmpty()
  userId: number;

  @IsOptional() 
  @IsString()
  @MaxLength(255)
  major?: string;

  @IsOptional() 
  @IsString()
  @MaxLength(255)
  level?: string;

  @IsOptional()
  @IsString()
  bio?: string;
}
export class UpdateProfessionDto extends PartialType(CreateProfessionDto) {}