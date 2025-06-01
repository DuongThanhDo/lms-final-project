import { Inject, Injectable } from '@nestjs/common';
import { Firestore } from 'firebase-admin/firestore';
import * as fireorm from 'fireorm';
import { v4 as uuidv4 } from 'uuid';
import { Answer } from '../collections/answers.collection';
import { AnswerMapper } from '../mappers/answer.mapper';

@Injectable()
export class AnswerService {
  constructor(
    @Inject('FIREBASE_ADMIN')
    private firestore: Firestore,
    @Inject('Answer')
    private answer: Answer,
  ) {
    fireorm.initialize(this.firestore);
  }

  async createAnswer(data: any) {
    try {
      const { questionId, quizId, body } = data;

      const documents = {
        id: uuidv4(),
        ...AnswerMapper.toAnswerMapper({
          ...body,
        }),
      };

      const doc = this.firestore
        .collection(
          `quizzes/${quizId}/Questions/${questionId}/Answers`,
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

  async all(quiz_id: string, question_id: string) {
    try {
      const collection = this.firestore.collection(
        `quizzes/${quiz_id}/Questions/${question_id}/Answers`,
      );
      const snapshot = await collection.get();

      const docs: any[] = [];
      snapshot.docs.forEach((doc) => {
        docs.push(doc.data());
      });

      return docs;
    } catch (error: any) {
      console.error('Error fetching quizzes:', error);
      throw error;
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

  async updateBulk(quiz_id: string, question_id: string, bulkData: any) {
    try {
      bulkData.forEach((item: any) => {
        this.update(quiz_id, question_id, item.answer_id, item.data);
      });

      return true;
    } catch (error: any) {
      return false;
    }
  }
}