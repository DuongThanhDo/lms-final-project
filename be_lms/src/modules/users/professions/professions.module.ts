import { Module } from '@nestjs/common';
import { ProfessionsController } from './professions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profession } from './professions.entity';
import { ProfessionsService } from './professions.service';

@Module({
  imports: [TypeOrmModule.forFeature([Profession])],
  controllers: [ProfessionsController],
  providers: [ProfessionsService],
  exports: [ProfessionsService, TypeOrmModule]
})
export class ProfessionsModule {}
