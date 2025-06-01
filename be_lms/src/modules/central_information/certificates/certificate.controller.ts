import { Controller, Post, Body, Get, Param, Patch, Delete, Query } from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { CreateCertificateDto, UpdateCertificateDto } from './certificate.dto';

@Controller('certificates')
export class CertificateController {
  constructor(private readonly service: CertificateService) {}

  @Post()
  create(@Body() dto: CreateCertificateDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('status')
  findAllStatus(@Query('status') status: boolean) {
    return this.service.findAllStatus(status);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCertificateDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
