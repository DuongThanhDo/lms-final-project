import { Inject, Injectable } from '@nestjs/common';
import { Firestore } from 'firebase-admin/firestore';
import * as fireorm from 'fireorm';
import { v4 as uuidv4 } from 'uuid';
import { Answer } from '../collections/answers.collection';
import { AnswerMapper } from '../mappers/answer.mapper';

@Injectable()
export class AnswerCorrectService {
  constructor(
    @Inject('FIREBASE_ADMIN')
    private firestore: Firestore,
    @Inject('Answer')
    private answer: Answer,
  ) {
    fireorm.initialize(this.firestore);
  }

  async create(data: any) {
    try {
      const { body } = data;

      const documents = {
        id: uuidv4(),
        ...AnswerMapper.toAnswerMapper({
          ...body,
        }),
      };

      const doc = this.firestore
        .collection(
          `quizzes/${body.quiz_id}/Questions/${body.question_id}/Answers`,
        )
        .doc(documents.id);

      await doc.set(documents);
      
      return documents;
    } catch (error: any) {
      console.error();
    }
  }

  async remove(
    quiz_id: string,
    question_id: string,
    answer_id: string,
  ): Promise<boolean> {
    try {
      const collection = this.firestore.collection(
        `quizzes/${quiz_id}/Questions/${question_id}/Answers`,
      );
      await collection.doc(answer_id).delete();
      return true;
    } catch (error: any) {
      console.error('Error deleting document:', error);
      return false;
    }
  }

  async update(
    quiz_id: string,
    question_id: string,
    answer_id: string,
    updateData: any,
  ) {
    try {
      const docRef = this.firestore
        .collection(
          `quizzes/${quiz_id}/Questions/${question_id}/Answers`,
        )
        .doc(answer_id);
      await docRef.update(updateData);
      return true;
    } catch (error: any) {
      return false;
    }
  }
}