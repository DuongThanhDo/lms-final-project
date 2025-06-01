import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class CommentsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() data: { contentType: string; contentId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const roomName = `${data.contentType}-${data.contentId}`;
    client.join(roomName);
    console.log(`Client ${client.id} joined room ${roomName}`);
  }

  sendNewComment(comment: any) {
    const roomName = `${comment.commentable_type}-${comment.commentable_id}`;
    this.server.to(roomName).emit('newComment', comment);
    console.log(`Emit comment to room ${roomName}`);
  }
}
