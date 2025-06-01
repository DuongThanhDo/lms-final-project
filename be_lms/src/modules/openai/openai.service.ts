import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class OpenAIService {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async generateQuestion(userDescription: string) {
    const prompt = `
        Hãy tạo một câu hỏi trắc nghiệm với 4 đáp án, trong đó chỉ có 1 đáp án đúng (correct: true), các đáp án còn lại là sai (correct: false).
        Trả về JSON theo định dạng sau:

        {
          "name": "Câu hỏi",
          "explain": "Giải thích câu hỏi",
          "answers": [
            { "value": "Đáp án 1", "correct": false },
            { "value": "Đáp án 2", "correct": false },
            { "value": "Đáp án 3", "correct": false },
            { "value": "Đáp án 4", "correct": true }
          ]
        }

        Mô tả đề bài: ${userDescription}
        Chỉ trả về JSON, không có giải thích gì thêm.
    `;

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'Bạn là trợ lý tạo câu hỏi trắc nghiệm.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 500,
    });

    const choices = completion.choices;
    if (!choices || choices.length === 0) {
      throw new Error('Không có câu trả lời từ OpenAI');
    }
    const message = choices[0].message;
    if (!message || !message.content) {
      throw new Error('Câu trả lời không có nội dung');
    }

    const jsonString = message.content.trim();

    let question;
    try {
      question = JSON.parse(jsonString);
    } catch (err) {
      throw new Error('Không parse được JSON từ OpenAI: ' + err.message);
    }

    question.answers = this.shuffleAnswers(question.answers);

    return question;
  }

  shuffleAnswers = (answers: { value: string; correct: boolean }[]) => {
    for (let i = answers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [answers[i], answers[j]] = [answers[j], answers[i]];
    }
    return answers;
  }
}
