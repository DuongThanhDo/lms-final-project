import { IsString } from 'class-validator';

export class QuizDTO {
  @IsString()
  name?: string;
}
