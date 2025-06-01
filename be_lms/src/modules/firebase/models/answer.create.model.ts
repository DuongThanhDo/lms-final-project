import { ApiProperty } from '@nestjs/swagger';

export class AnswerCreateModel {
  @ApiProperty({ name: 'question_id' })
  question_id: string;

  @ApiProperty({ name: 'value' })
  value: string;
}