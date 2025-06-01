import { Module } from '@nestjs/common';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfile } from './profiles.entity';
import { MediaModule } from 'src/modules/medias/medias.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserProfile]), MediaModule],
  controllers: [ProfilesController],
  providers: [ProfilesService],
  exports: [ProfilesService, TypeOrmModule],
})
export class ProfilesModule {}
