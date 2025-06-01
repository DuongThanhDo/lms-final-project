import { Controller, Post, Body, Param, Get, Patch, Delete } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto, UpdateCommentDto } from './comment.dto';
import { CommentableType } from 'src/common/constants/enum';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(@Body() dto: CreateCommentDto) {
    return this.commentsService.create(dto);
  }

  @Get()
  findAll() {
    return this.commentsService.findAll();
  }

  @Get(':type/:id')
  findByTarget(@Param('type') type: CommentableType, @Param('id') id: number) {
    return this.commentsService.findByContentTarget(type, id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateCommentDto) {
    return this.commentsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.commentsService.remove(id);
  }
}
