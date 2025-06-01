import { IsEmail, IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';

export class SendEmailDto {
  @IsEmail()
  to: string;

  @IsNotEmpty()
  @IsString()
  subject: string;

  @IsOptional()
  @IsString()
  template?: string;

  @IsOptional()
  context?: Record<string, any>;

  @ValidateIf(o => !o.template)
  @IsNotEmpty()
  @IsString()
  html?: string;
}