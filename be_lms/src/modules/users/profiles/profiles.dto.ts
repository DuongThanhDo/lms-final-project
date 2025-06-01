import { IsNotEmpty, IsOptional, IsString, IsBoolean, IsDateString, IsNumber } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateUserProfileDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsDateString()
  date_of_birth?: string;

  @IsOptional()
  @IsBoolean()
  gender?: boolean;

  @IsOptional()
  @IsString()
  address?: string;
}

export class UpdateUserProfileDto extends PartialType(CreateUserProfileDto) {}