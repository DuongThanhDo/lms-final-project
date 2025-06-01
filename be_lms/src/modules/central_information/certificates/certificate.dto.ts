import { IsNotEmpty, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateCertificateDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  status?: boolean;

  @IsOptional()
  formBuilt?: any;
}

export class UpdateCertificateDto extends PartialType(CreateCertificateDto) {}
