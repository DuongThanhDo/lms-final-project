import { IsString, IsOptional } from 'class-validator';

export class QuestionDto {
  @IsString()
  quizId: string;
  
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  explain: string;
}

export class UpdateQuestionDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  explain: string;
}
