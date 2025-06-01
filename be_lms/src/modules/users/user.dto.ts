import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from 'src/common/constants/enum';

export class CreateUserDto {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  password: string;

  @IsEnum(UserRole, { message: 'Vai trò không hợp lệ' })
  role: UserRole;
}

export class CreateUserByAdminDto {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  password: string;

  @IsEnum(UserRole, { message: 'Vai trò không hợp lệ' })
  role: UserRole;

  @IsString()
  name: string;

  @IsString()
  phone: string;
}

export class ExistingUserDto {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  password: string;

  @IsEnum(UserRole, { message: 'Vai trò không hợp lệ' })
  expectedRole: UserRole;
}

export class ChangePasswordDto {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  oldPassword: string;

  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  newPassword: string;
}
