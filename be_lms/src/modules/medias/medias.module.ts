import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from './media.entity';
import { MediaService } from './medias.service';
import { CloudinaryConfig } from 'src/config/cloudinary.config';
import { ConfigModule } from '@nestjs/config';
import { MediaController } from './medias.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Media]), ConfigModule],
  providers: [MediaService, CloudinaryConfig],
  controllers: [MediaController],
  exports: [MediaService]
})
export class MediaModule {}
