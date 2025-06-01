import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizSQL } from './quizSQL.entity';
import { QuizSQLController } from './quizSQL.controller';
import { QuizSQLService } from './quizSQL.service';
import { Chapter } from '../chapters.entity';
import { FirebaseModule } from 'src/modules/firebase/firebase.module';

@Module({
  imports: [TypeOrmModule.forFeature([QuizSQL, Chapter]), FirebaseModule],
  controllers: [QuizSQLController],
  providers: [QuizSQLService],
})
export class QuizSQLModule {}
