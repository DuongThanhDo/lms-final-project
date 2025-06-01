import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { MessagesGateway } from './messages.gateway';
import { Message } from './message.entity';
import { User } from '../users/user.entity';
import { Conversation } from './conversation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message, User, Conversation])],
  providers: [MessagesService, MessagesGateway],
  controllers: [MessagesController],
})
export class MessagesModule {}
