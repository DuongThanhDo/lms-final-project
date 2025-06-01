import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsInt, IsNotEmpty, Min, Length } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  name: string;

  @IsInt()
  @Min(1)
  capacity: number;
}

export class UpdateRoomDto extends PartialType(CreateRoomDto) {}