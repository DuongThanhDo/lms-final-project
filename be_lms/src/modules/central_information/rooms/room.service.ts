import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './room.entity';
import { CreateRoomDto, UpdateRoomDto } from './room.dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
  ) {}

  async findAll(): Promise<Room[]> {
    return this.roomRepository.find();
  }

  async findOne(id: number): Promise<Room> {
    const room = await this.roomRepository.findOne({ where: { id } });
    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }
    return room;
  }

  async create(createDto: CreateRoomDto): Promise<Room> {
    const newRoom = this.roomRepository.create(createDto);
    return this.roomRepository.save(newRoom);
  }

  async update(id: number, updateDto: UpdateRoomDto): Promise<Room> {
    const room = await this.findOne(id);
    const updatedRoom = { ...room, ...updateDto };
    return this.roomRepository.save(updatedRoom);
  }

  async remove(id: number): Promise<void> {
    const result = await this.roomRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }
  }
}
