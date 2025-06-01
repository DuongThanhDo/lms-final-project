import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto, UpdateCommentDto } from './comment.dto';
import { Comment } from './comment.entity';
import { CommentableType } from 'src/common/constants/enum';
import { User } from '../users/user.entity';
import { CommentsGateway } from './comments.gateway';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepo: Repository<Comment>,

    @InjectRepository(User)
    private userRepo: Repository<User>,

    private gateway: CommentsGateway,
  ) {}
  async getFullComment(id: number) {
    return this.commentRepo.findOne({
      where: { id },
      relations: ['user', 'user.profile', 'user.profile.avatar'],
    });
  }

  async create(dto: CreateCommentDto) {
    const user = await this.userRepo.findOne({
      where: { id: Number(dto.user_id) },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${dto.user_id} not found`);
    }

    const comment = this.commentRepo.create({
      ...dto,
      user_id: user.id,
    });

    const saved = await this.commentRepo.save(comment);
    const fullComment = await this.getFullComment(saved.id);
    this.gateway.sendNewComment(fullComment);
    console.log(
      'Sent comment to socket room:',
      `${fullComment?.commentable_type}-${fullComment?.commentable_id}`,
    );

    return fullComment;
  }

  findAll() {
    return this.commentRepo.find({
      relations: ['user', 'user.profile', 'user.profile.avatar'],
      order: { updated_at: 'DESC' },
    });
  }

  findByContentTarget(type: CommentableType, id: number) {
    return this.commentRepo.find({
      where: {
        commentable_type: type,
        commentable_id: id,
      },
      relations: ['user', 'user.profile', 'user.profile.avatar'],
      order: { updated_at: 'DESC' },
    });
  }

  async update(id: number, dto: UpdateCommentDto) {
    const comment = await this.commentRepo.findOne({ where: { id } });
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    await this.commentRepo.update(id, dto);

    return this.commentRepo.findOne({ where: { id }, relations: ['user'] });
  }

  async remove(id: number) {
    const comment = await this.commentRepo.findOne({ where: { id } });
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    return this.commentRepo.delete(id);
  }
}
