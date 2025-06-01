import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CentralInformation } from './central-information.entity';
import { CentralInformationService } from './central-information.service';
import { CentralInformationController } from './central-information.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CentralInformation])],
  providers: [CentralInformationService],
  controllers: [CentralInformationController],
})
export class CentralInformationModule {}
