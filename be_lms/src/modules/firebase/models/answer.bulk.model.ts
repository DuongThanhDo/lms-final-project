import { ApiProperty } from '@nestjs/swagger';
import { AnswerUpdateModel } from './answer.update.model';

export class AnswerBulkModel {
  @ApiProperty({ name: 'items', type: [AnswerUpdateModel] })
  public items: AnswerUpdateModel[];
}