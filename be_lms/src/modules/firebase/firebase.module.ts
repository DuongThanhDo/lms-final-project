import { Module } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { QuestionController } from './controllers/questions.controller';
import { QuizController } from './controllers/quiz.controller';
import { AnswerController } from './controllers/answer.controller';
import { QuestionService } from './services/question.service';
import { AnswerService } from './services/answer.service';
import { Quiz } from './collections/quiz.collection';
import { AnswerCorrect } from './collections/answer_correct.collection';
import { Answer } from './collections/answers.collection';
import { Question } from './collections/questions.collection';
import { QuizService } from './services/quiz.service';


@Module({
    imports: [],
    controllers: [
        QuestionController,
        QuizController,
        AnswerController
    ],
    providers: [
        QuestionService,
        AnswerService,
        QuizService,
        {
            provide: 'FIREBASE_ADMIN',
            useFactory: () => {
                const firebaseAdminConfig = JSON.parse(process.env.FIREBASE_ADMIN_SDK_JSON!);
                admin.initializeApp({
                    credential: admin.credential.cert(firebaseAdminConfig),
                    databaseURL: "https://lms-quiz-be695.firebaseio.com"
                });
                return admin.firestore();
            },
        },
        {
            provide: 'Question',
            useFactory: () => {
                return new Question();
            }
        },
        {
            provide: 'Answer',
            useFactory: () => {
                return new Answer();
            }
        },
        {
            provide: 'AnswerCorrect',
            useFactory: () => {
                return new AnswerCorrect();
            }
        },
        {
            provide: 'Quiz',
            useFactory: () => {
                return new Quiz();
            }
        }
    ],
    exports: [QuizService],
})
export class FirebaseModule { }