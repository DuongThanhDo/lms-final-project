import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CertificateService } from './certificate.service';
import { CertificateController } from './certificate.controller';
import { Certificate } from './certificate.entity';
import { Course } from 'src/modules/courses/courses.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Certificate, Course])],
  providers: [CertificateService],
  controllers: [CertificateController],
})
export class CertificateModule {}
