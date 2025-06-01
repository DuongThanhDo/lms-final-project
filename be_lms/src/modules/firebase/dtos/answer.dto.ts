import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class AnswerDto {
  @IsString()
  quizId: string;
  
  @IsString()
  questionId: string;

  @IsString()
  value: string;

  @IsBoolean()
  correct: boolean;
}

export class UpdateAnswerDto {
  @IsString()
  value?: string;

  @IsBoolean()
  correct?: boolean;
}
