import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsNumber()
  senderId: number;
  

  @IsNotEmpty()
  @IsNumber()
  conversationId: number;
}