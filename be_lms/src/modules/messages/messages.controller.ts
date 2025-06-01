import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Param,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './message.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post('conversation')
  async createConversation(@Body('participantIds') participantIds: number[]) {
    if (!participantIds || participantIds.length < 2) {
      throw new BadRequestException('Conversation must have at least 2 participants');
    }
    return this.messagesService.createConversation(participantIds);
  }

  @Post()
  async createMessage(@Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.createMessage(createMessageDto);
  }

  @Get('conversation/:id/messages')
  async getMessagesByConversation(@Param('id', ParseIntPipe) conversationId: number) {
    return this.messagesService.findMessagesByConversation(conversationId);
  }

  @Get('conversation/:id')
  async getConversationWithParticipants(@Param('id', ParseIntPipe) conversationId: number) {
    return this.messagesService.getConversationWithParticipants(conversationId);
  }

  @Get('user/:id/conversations')
  async getUserConversations(@Param('id', ParseIntPipe) userId: number) {
    return this.messagesService.findUserConversations(userId);
  }
  
    @Get('conversation-between')
  async findConversationBetweenUsers(
    @Query('user1', ParseIntPipe) user1: number,
    @Query('user2', ParseIntPipe) user2: number,
  ) {
    if (!user1 || !user2) {
      throw new BadRequestException('Both user1 and user2 must be provided');
    }
    return this.messagesService.findConversation(user1, user2);
  }
}
