import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CentralInformation } from './central-information.entity';
import { CreateCentralInformationDto, UpdateCentralInformationDto } from './central-information.dto';

@Injectable()
export class CentralInformationService {
  constructor(
    @InjectRepository(CentralInformation)
    private centralInfoRepository: Repository<CentralInformation>,
  ) {}

  async findAll(): Promise<CentralInformation[]> {
    return this.centralInfoRepository.find();
  }

  async findOne(id: number): Promise<CentralInformation> {
    const centralInfo = await this.centralInfoRepository.findOne({ where: { id } });
    if (!centralInfo) {
      throw new NotFoundException(`Central Information with ID ${id} not found`);
    }
    return centralInfo;
  }

  async create(createDto: CreateCentralInformationDto): Promise<CentralInformation> {
    const newCentralInfo = this.centralInfoRepository.create(createDto);
    return this.centralInfoRepository.save(newCentralInfo);
  }

  async update(id: number, updateDto: UpdateCentralInformationDto): Promise<CentralInformation> {
    const existingCentralInfo = await this.findOne(id);
    const updatedCentralInfo = { ...existingCentralInfo, ...updateDto };
    return this.centralInfoRepository.save(updatedCentralInfo);
  }

  async remove(id: number): Promise<void> {
    const result = await this.centralInfoRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Central Information with ID ${id} not found`);
    }
  }
}
