import { Controller, Post, Body } from '@nestjs/common';
import { OpenAIService } from './openai.service';

@Controller('openai')
export class OpenAIController {
  constructor(private readonly openAIService: OpenAIService) {}

  @Post('questions')
  async generateQuestion(@Body('description') description: string) {
    if (!description) {
      return { error: 'Missing description in body' };
    }

    const question = await this.openAIService.generateQuestion(description);
    return question;
  }
}
