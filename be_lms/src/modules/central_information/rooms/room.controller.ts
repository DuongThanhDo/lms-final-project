import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { RoomService } from './room.service';
import { Room } from './room.entity';
import { CreateRoomDto, UpdateRoomDto } from './room.dto';

@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get()
  findAll(): Promise<Room[]> {
    return this.roomService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Room> {
    return this.roomService.findOne(id);
  }

  @Post()
  create(@Body() createDto: CreateRoomDto): Promise<Room> {
    return this.roomService.create(createDto);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateDto: UpdateRoomDto): Promise<Room> {
    return this.roomService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.roomService.remove(id);
  }
}
