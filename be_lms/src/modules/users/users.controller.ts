import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, ExistingUserDto, ChangePasswordDto, CreateUserByAdminDto } from './user.dto';
import { UserRole } from 'src/common/constants/enum';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  findAllByRole(@Query('role') role: UserRole) {
    return this.usersService.findAllByRole(role);
  }

  @Get(':id')
  findById(@Param('id') id: String) {
    return this.usersService.findById(+id);
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.register(createUserDto);
  }

  @Post('registerByAdmin')
  async registerByAdmin(@Body() createUserByAdminDto: CreateUserByAdminDto) {
    return this.usersService.registerByAdmin(createUserByAdminDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() existingUserDto: ExistingUserDto) {
    return this.usersService.login(existingUserDto);
  }

  @Patch('lock/:id')
  async toggleLock(@Param('id') id: string, @Body('isLock') isLock: boolean) {
    return this.usersService.toggleLock(+id, isLock);
  }

  @Post('google')
  async googleLogin(@Body('token') token: string) {
    return this.usersService.loginWithGoogle(token);
  }

  @Patch('change-password')
  async ChangePassword(@Body() changePassword: ChangePasswordDto) {
    return this.usersService.changePassword(changePassword);
  }
}
