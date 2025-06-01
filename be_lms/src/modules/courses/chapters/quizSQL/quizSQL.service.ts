import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuizSQL } from './quizSQL.entity';
import { CreateQuizSQLDto, UpdateQuizSQLDto } from './quizSQL.dto';
import { Chapter } from '../chapters.entity';
import { QuizService } from 'src/modules/firebase/services/quiz.service';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';

@Injectable()
export class QuizSQLService {
  constructor(
    @InjectRepository(QuizSQL)
    private quizSQLRepository: Repository<QuizSQL>,
    @InjectRepository(Chapter)
    private chapterRepository: Repository<Chapter>,

    private readonly quizService: QuizService,
  ) {}

  async create(createQuizSQLDto: CreateQuizSQLDto): Promise<QuizSQL> {
    const chapter = await this.chapterRepository.findOne({
      where: { id: createQuizSQLDto.chapterId },
    });

    console.log(createQuizSQLDto);

    if (!chapter) {
      throw new Error('Chapter not found');
    }
    const qId = UUID;
    const quizId = await this.quizService.createQuiz({
      id: qId,
      body: { name: createQuizSQLDto.name },
    });

    if (!quizId) throw new BadRequestException('Error create quiz firebase');

    const quizSQL = this.quizSQLRepository.create({
      ...createQuizSQLDto,
      chapter,
      quizFB_id: quizId,
    });
    return await this.quizSQLRepository.save(quizSQL);
  }

  async update(
    id: number,
    updateQuizSQLDto: UpdateQuizSQLDto,
  ): Promise<QuizSQL> {
    const quiz = await this.findOne(id);

    const quizSQL = await this.quizSQLRepository.findOne({ where: { id } });

    if (quizSQL?.quizFB_id != null)
      await this.quizService.update(quizSQL.quizFB_id, updateQuizSQLDto);
    Object.assign(quiz, updateQuizSQLDto);
    return await this.quizSQLRepository.save(quiz);
  }

  async findAll(): Promise<QuizSQL[]> {
    return this.quizSQLRepository.find();
  }

  async findOne(id: number): Promise<QuizSQL> {
    const quizSQL = await this.quizSQLRepository.findOne({ where: { id } });
    if (!quizSQL) {
      throw new NotFoundException(`Quiz with ID ${id} not found`);
    }
    return quizSQL;
  }

  async remove(id: number): Promise<void> {
    const quizSQL = await this.quizSQLRepository.findOne({ where: { id } });

    if (quizSQL?.quizFB_id != null)
      await this.quizService.delete(quizSQL.quizFB_id);
    await this.quizSQLRepository.delete(id);
  }
}
