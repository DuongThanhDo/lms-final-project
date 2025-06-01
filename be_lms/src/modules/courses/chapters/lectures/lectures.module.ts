import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LecturesService } from './lectures.service';
import { LecturesController } from './lectures.controller';
import { Lecture } from './lectures.entity';
import { Chapter } from '../chapters.entity';
import { MediaModule } from 'src/modules/medias/medias.module';

@Module({
  imports: [TypeOrmModule.forFeature([Lecture, Chapter]), MediaModule],
  providers: [LecturesService],
  controllers: [LecturesController],
})
export class LecturesModule {}
