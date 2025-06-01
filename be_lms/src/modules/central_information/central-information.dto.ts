import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsNotEmpty, IsEmail, Length } from 'class-validator';

export class CreateCentralInformationDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @Length(0, 20)
  phone: string;

  @IsString()
  @Length(0, 255)
  address: string;

  @IsString()
  description: string;
}

export class UpdateCentralInformationDto extends PartialType(CreateCentralInformationDto) {}