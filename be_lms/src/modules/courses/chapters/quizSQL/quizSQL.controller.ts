// controller/quizSQL.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { QuizSQLService } from './quizSQL.service';
import { QuizSQL } from './quizSQL.entity';
import { CreateQuizSQLDto, UpdateQuizSQLDto } from './quizSQL.dto';


@Controller('quizSQL')
export class QuizSQLController {
  constructor(private readonly quizSQLService: QuizSQLService) {}

  @Post()
  async create(@Body() createQuizSQLDto: CreateQuizSQLDto): Promise<QuizSQL> {
    return this.quizSQLService.create(createQuizSQLDto);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateQuizSQLDto: UpdateQuizSQLDto): Promise<QuizSQL> {
    return this.quizSQLService.update(id, updateQuizSQLDto);
  }

  @Get()
  async findAll(): Promise<QuizSQL[]> {
    return this.quizSQLService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<QuizSQL> {
    return this.quizSQLService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.quizSQLService.remove(id);
  }
}
