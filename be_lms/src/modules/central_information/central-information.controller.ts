import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { CentralInformationService } from './central-information.service';
import { CentralInformation } from './central-information.entity';
import { CreateCentralInformationDto, UpdateCentralInformationDto } from './central-information.dto';

@Controller('central-information')
export class CentralInformationController {
  constructor(private readonly centralInfoService: CentralInformationService) {}

  @Get()
  findAll(): Promise<CentralInformation[]> {
    return this.centralInfoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<CentralInformation | null> {
    return this.centralInfoService.findOne(id);
  }

  @Post()
  create(@Body() createDto: CreateCentralInformationDto): Promise<CentralInformation> {
    return this.centralInfoService.create(createDto);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateDto: UpdateCentralInformationDto,
  ): Promise<CentralInformation> {
    return this.centralInfoService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.centralInfoService.remove(id);
  }
}
