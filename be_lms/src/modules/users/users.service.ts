import {
  ChangePasswordDto,
  CreateUserByAdminDto,
  CreateUserDto,
  ExistingUserDto,
} from './user.dto';
import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserProfile } from './profiles/profiles.entity';
import { UserRole } from 'src/common/constants/enum';
import { Profession } from './professions/professions.entity';
import { plainToInstance } from 'class-transformer';
import { OAuth2Client } from 'google-auth-library';
import { MediaService } from 'src/modules/medias/medias.service';
import { Media } from '../medias/media.entity';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private readonly mediaService: MediaService,

    @InjectRepository(UserProfile)
    private userProfileRepository: Repository<UserProfile>,
    @InjectRepository(Media)
    private mediaRepository: Repository<Media>,
    @InjectRepository(Profession)
    private professionRepository: Repository<Profession>,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async comparePasswords(
    password: string,
    hashPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashPassword);
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    const doesUserExist = !!user;

    if (!doesUserExist) return null;

    const doesPasswordMatch = await this.comparePasswords(
      password,
      user.password,
    );

    if (!doesPasswordMatch) return null;

    return user;
  }

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find();
    return plainToInstance(User, users);
  }

  async findById(id: number): Promise<User | null> {
    const users = await this.userRepository.findOne({
      where: { id: id },
      relations: ['profile', 'profile.avatar']
    });

    return plainToInstance(User, users);
  }

  async findAllByRole(role: UserRole) {
    return this.userRepository.find({
      where: { role: role },
      relations: ['profile', 'profession', 'profile.avatar'],
    });
  }

  async toggleLock(id: number, isLock: boolean) {
    const user = await this.userRepository.findOne({
      where: { id: id },
    });
    if (!user) {
      throw new Error('User not found');
    }

    user.isLock = isLock;
    await this.userRepository.save(user);
    return user;
  }
  async findByEmail(email: string): Promise<User | any> {
    return this.userRepository.findOne({
      where: { email: email },
    });
  }

  async register(CreateUserDto: CreateUserDto): Promise<User | any> {
    try {
      const { email, password, role } = CreateUserDto;

      const existingUser = await this.findByEmail(email);

      if (existingUser) {
        throw new BadRequestException('Email đã tồn tại!');
      }

      const hashPassword = await this.hashPassword(password);

      const newUser = this.userRepository.create({
        email,
        password: hashPassword,
        role,
      });
      const savedUser = await this.userRepository.save(newUser);

      const profile = this.userProfileRepository.create({
        user: savedUser,
      });
      await this.userProfileRepository.save(profile);

      if (role === UserRole.TEACHER) {
        const profession = this.professionRepository.create({
          user: savedUser,
        });
        await this.professionRepository.save(profession);
      }

      return savedUser;
    } catch (error) {
      throw new HttpException(
        'Không thể tạo người dùng. Lỗi: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async registerByAdmin(
    CreateUserByAdminDto: CreateUserByAdminDto,
  ): Promise<any> {
    try {
      const { email, password, role, name, phone } = CreateUserByAdminDto;

      const existingUser = await this.findByEmail(email);

      if (existingUser) {
        throw new BadRequestException('Email đã tồn tại!');
      }

      const hashPassword = await this.hashPassword(password);

      const newUser = this.userRepository.create({
        email,
        password: hashPassword,
        role,
      });
      const savedUser = await this.userRepository.save(newUser);

      const profile = this.userProfileRepository.create({
        user: savedUser,
        name,
        phone,
      });
      await this.userProfileRepository.save(profile);

      if (role === UserRole.TEACHER) {
        const profession = this.professionRepository.create({
          user: savedUser,
        });
        await this.professionRepository.save(profession);
      }

      return {
        newUser,
        profile,
      };
    } catch (error) {
      throw new HttpException(
        'Không thể tạo người dùng. Lỗi: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login(
    existingUserDto: ExistingUserDto,
  ): Promise<{ token: string } | null | User | any> {
    const { email, password, expectedRole } = existingUserDto;
    const vUser = await this.validateUser(email, password);

    if (!vUser) return null;

    if (vUser.role !== expectedRole) {
      throw new ForbiddenException(
        `Bạn không có quyền đăng nhập vào hệ thống này.`,
      );
    }

    if (vUser.isLock) {
      throw new ForbiddenException(`Tài khoản của bạn đã bị khóa!`);
    }

    const user = plainToInstance(User, vUser);

    const jwt = await this.jwtService.signAsync({ user });

    return { token: jwt };
  }

  async loginWithGoogle(token: string) {
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new HttpException(
          'Invalid Google token payload',
          HttpStatus.BAD_REQUEST,
        );
      }

      const email = payload.email || '';
      const name = payload.name;
      const avatar = payload.picture;

      let user = await this.findByEmail(email);

      if (!user) {
        user = this.userRepository.create({
          email,
          password: undefined,
          role: UserRole.STUDENT,
        });
        user = await this.userRepository.save(user);

        let media = this.mediaRepository.create({
          file_url: avatar,
          file_type: 'google',
        });
        media = await this.mediaRepository.save(media);

        const profile = this.userProfileRepository.create({
          user: user,
          name: name,
          avatar: media,
        });
        await this.userProfileRepository.save(profile);
      }
      if (user.isLock) {
        throw new ForbiddenException(`Tài khoản của bạn đã bị khóa!`);
      }

      const jwtPayload = { sub: user.id, email: user.email };
      const accessToken = this.jwtService.sign(jwtPayload);

      return { accessToken, user };
    } catch (error) {
      throw new HttpException(
        `Google login failed: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async changePassword(changeDto: ChangePasswordDto): Promise<any> {
    const { email, oldPassword, newPassword } = changeDto;

    const user = await this.validateUser(email, oldPassword);

    if (!user) throw new BadRequestException('Mật khẩu cũ sai!');

    const hashPassword = await this.hashPassword(newPassword);

    user.password = hashPassword;

    await this.userRepository.save(user);

    return { message: 'Mật khẩu đã được thay đổi thành công!' };
  }
}
