import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { ProfessionsService } from './professions.service';
import { UpdateProfessionDto } from './professions.dto';

@Controller('professions')
export class ProfessionsController {
  constructor(private readonly professionsService: ProfessionsService) {}

  @Get(':userId')
  findByUser(@Param('userId') userId: number) {
    return this.professionsService.findByUser(userId);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateProfessionDto: UpdateProfessionDto,
  ) {
    return this.professionsService.update(id, updateProfessionDto);
  }
}
