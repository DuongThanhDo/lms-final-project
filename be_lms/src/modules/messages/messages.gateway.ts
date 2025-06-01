import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './message.dto';

@WebSocketGateway({ cors: { origin: '*' } })
export class MessagesGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private onlineUsers = new Map<number, string>();

  constructor(private readonly messagesService: MessagesService) {}

  @SubscribeMessage('userConnected')
  handleUserConnected(@MessageBody() userId: number, @ConnectedSocket() client: Socket) {
    this.onlineUsers.set(userId, client.id);
    this.server.emit('onlineUsers', Array.from(this.onlineUsers.keys()));
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(@MessageBody() messageDto: CreateMessageDto) {
    // Lưu message vào DB
    const message = await this.messagesService.createMessage(messageDto);

    // Lấy danh sách participants trong conversation
    const conversation = await this.messagesService.getConversationWithParticipants(messageDto.conversationId);

    if (!conversation) return;

    // Gửi message cho tất cả participants đang online trong conversation
    conversation.participants.forEach(user => {
      const socketId = this.onlineUsers.get(user.id);
      if (socketId) {
        this.server.to(socketId).emit('newMessage', message);
      }
    });
  }

  handleDisconnect(client: Socket) {
    // Xóa user khỏi onlineUsers khi disconnect
    for (const [userId, socketId] of this.onlineUsers.entries()) {
      if (socketId === client.id) {
        this.onlineUsers.delete(userId);
        this.server.emit('onlineUsers', Array.from(this.onlineUsers.keys()));
        break;
      }
    }
  }
}
