import { Injectable } from '@nestjs/common';
import { Collection, ISubCollection, SubCollection } from 'fireorm';
import { Question } from './questions.collection';

@Injectable()
@Collection('quizzes')
export class Quiz {
    id: string;
    name: string;
    
    @SubCollection(Question)
    questions?: ISubCollection<Question>;
}