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
import { QuizService } from '../services/quiz.service';
import { Quiz } from '../collections/quiz.collection';
import { QuizDTO } from '../dtos/quiz.dto';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';
  
  @Controller('quizzes')
  export class QuizController {
    constructor(private quizService: QuizService) {}
  
    /**
     *
     * @param req
     * @param res
     * @returns
     */
    @Post('')
    async create(
      @Res() res: Response,
      @Body() body: QuizDTO,
    ) {
      try {
        const id = UUID;

        console.log('Body:', body);
        await this.quizService.createQuiz({
          id,
          body,
        });
  
        return res.status(200).send('Create Collection Successfull !');
      } catch (error) {
        res.status(500).send('An error occurred');
      }
    }
  
    @Delete(':id')
    async delete(@Param('id') id: string, @Res() res: Response) {
      try {
        await this.quizService.delete(id);
        return res.status(200).send('Create Collection Successfull !');
      } catch (error) {
        res.status(500).send('An error occurred');
      }
    }
  
    @Put(':id')
    async update(
      @Param('id') id: string,
      @Res() res: Response,
      @Req() req: Request,
      @Body() body: Quiz,
    ) {
      try {
        await this.quizService.update(id, body);
        return res.status(200).send('Create Collection Successfull !');
      } catch (error) {
        res.status(500).send('An error occurred');
      }
    }
  
    @Get(':id')
    async get(@Param('id') id: string, @Res() res: Response) {
      try {
        const cateData = await this.quizService.get(id, 'quizzs');
        const result = this.quizService.convertData(cateData);
  
        return res.status(200).json({
          data: result
        });
      } catch (error) {
        res.status(500).send('An error occurred');
      }
    }
  
    @Get('detail/:id')
    async getOne(@Param('id') id: string, @Res() res: Response) {
      try {
        const cateData = await this.quizService.getOne(id);
  
        return res.status(200).json({
          data: cateData
        });
      } catch (error) {
        res.status(500).send('An error occurred');
      }
    }
  
    @Get('')
    async all(@Res() res: Response) {
      try {
        const result = await this.quizService.all();
  
        return res.status(200).json({
          data: [...result],
        });
      } catch (error) {
        res.status(500).send('An error occurred');
      }
    }
  }