import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { Comment } from './comment.entity';
import { User } from '../users/user.entity';
import { UsersModule } from '../users/users.module';
import { CommentsGateway } from './comments.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, User]), UsersModule],
  controllers: [CommentsController],
  providers: [CommentsService, CommentsGateway],
})
export class CommentsModule {}
