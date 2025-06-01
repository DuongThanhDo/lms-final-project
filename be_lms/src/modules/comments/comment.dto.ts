import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CommentableType } from 'src/common/constants/enum';

export class CreateCommentDto {
  @IsNotEmpty()
  user_id: Number;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsEnum(CommentableType)
  commentable_type: CommentableType;

  @IsNumber()
  commentable_id: number;

  @IsOptional()
  @IsNumber()
  parent_id?: number;
}

export class UpdateCommentDto {
    @IsString()
    @IsNotEmpty()
    content: string;
  
    @IsEnum(CommentableType)
    commentable_type: CommentableType;
  
    @IsNumber()
    commentable_id: number;
  
    @IsOptional()
    @IsNumber()
    parent_id?: number;
  }
