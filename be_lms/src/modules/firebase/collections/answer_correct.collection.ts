import { Injectable } from '@nestjs/common';
import { Collection } from 'fireorm';

@Injectable()
// @Collection('answer_correct')
export class AnswerCorrect {
    id: string;
    question_id: string;
    answer_id: string;
    explain: string;
}