import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { JwtStrategy } from 'src/common/guards/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { UserProfile } from './profiles/profiles.entity';
import { Profession } from './professions/professions.entity';
import { Course } from '../courses/courses.entity';
import { MediaModule } from '../medias/medias.module';
import { Media } from '../medias/media.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserProfile, Profession, Course, Media]),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: 'secret',
        signOptions: { expiresIn: '3600s' },
      }),
    }),MediaModule
  ],
  providers: [UsersService, JwtGuard, JwtStrategy],
  controllers: [UsersController],
})
export class UsersModule {}
