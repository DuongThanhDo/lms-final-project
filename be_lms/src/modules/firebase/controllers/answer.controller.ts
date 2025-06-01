import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AnswerService } from '../services/answer.service';
import { Answer } from '../collections/answers.collection';
import { AnswerBulkModel } from '../models/answer.bulk.model';
import { AnswerDto, UpdateAnswerDto } from '../dtos/answer.dto';

@ApiTags('Answer')
@Controller('')
export class AnswerController {
  constructor(private answerService: AnswerService) {}
  /**
   * @param req
   * @param res
   * @param body
   * @returns
   */
  @Post('answers')
  async create(@Res() res: Response, @Body() body: AnswerDto) {
    try {
      const { questionId, quizId } = body;
      const data = await this.answerService.createAnswer({
        questionId,
        quizId,
        body,
      });
      return res.status(200).json(data);
    } catch (error) {
      res.status(500).send('An error occurred');
    } 
  }

  @Get('quizzes/:quizId/questions/:question_id/answers')
  async get(
    @Param('quizId') quizId: string,
    @Param('question_id') question_id: string,
    @Res() res: Response,
  ) {
    try {
      const result = await this.answerService.all(quizId, question_id);

      return res.status(200).json({
        data: [...result],
      });
    } catch (error) {
      res.status(500).send('An error occurred');
    }
  }

  @Delete('quizzes/:quizId/questions/:question_id/answers/:answer_id')
  async delete(
    @Param('quizId') quizId: string,
    @Param('question_id') question_id: string,
    @Param('answer_id') answer_id: string,
    @Res() res: Response,
  ) {
    try {
      await this.answerService.remove(quizId, question_id, answer_id);
      return res.status(200).send('Remove collection successfull !');
    } catch (error) {
      res.status(500).send('An error occurred');
    }
  }

  @Put('quizzes/:quizId/questions/:question_id/answers/:answer_id')
  async update(
    @Param('quizId') quizId: string,
    @Param('question_id') question_id: string,
    @Param('answer_id') answer_id: string,
    @Body() body: UpdateAnswerDto,
    @Res() res: Response,
  ) {
    try {
      const data = await this.answerService.update(
        quizId,
        question_id,
        answer_id,
        body,
      );
      return res.status(200).json(data);
    } catch (error: any) {
      return res.status(500).send('Update sucessful');
    }
  }

  @Put('quizzes/:quizId/questions/:question_id/answers')
  async updateBulk(
    @Param('quizId') quizId: string,
    @Param('question_id') question_id: string,
    @Body() body: AnswerBulkModel,
    @Res() res: Response,
  ) {
    try {
      await this.answerService.updateBulk(quizId, question_id, body);
      return res.status(200).send('Update collection successfull !');
    } catch (error: any) {
      return res.status(500).send('An error occurred');
    }
  }
}
