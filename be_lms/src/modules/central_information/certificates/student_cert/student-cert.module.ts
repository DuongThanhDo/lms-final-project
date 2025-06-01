import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentCertService } from './student-cert.service';
import { StudentCertController } from './student-cert.controller';
import { StudentCert } from './student-cert.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StudentCert])],
  controllers: [StudentCertController],
  providers: [StudentCertService],
})
export class StudentCertModule {}
