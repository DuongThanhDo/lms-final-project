import { Inject, Injectable } from '@nestjs/common';
import { Firestore } from 'firebase-admin/firestore';
import * as fireorm from 'fireorm';
import { Question } from '../collections/questions.collection';
import { v4 as uuidv4 } from 'uuid';
import { Quiz } from '../collections/quiz.collection';
import { QuestionMapper } from '../mappers/question.mapper';

@Injectable()
export class QuestionService {
  constructor(
    @Inject('FIREBASE_ADMIN')
    private firestore: Firestore,
    @Inject('Question')
    private question: Question,
    @Inject('Quiz')
    private quiz: Quiz,
  ) {
    fireorm.initialize(this.firestore);
  }

  async createQuestion(data: any) {
    try {
      const { quizId, body } = data;

      const documents = {
        id: uuidv4(),
        ...QuestionMapper.toQuestionMapper({
          ...body,
        }),
      };

      if (quizId) {
        const quizRepository = fireorm.getRepository(Quiz);
        const quizFindById = await quizRepository.findById(quizId);

        if (!quizFindById) {
          throw new Error(`quiz with id ${quizId} not found`);
        }

        const questions = quizFindById.questions;

        return await questions?.create(documents);
      } else {
        const questionRepository = fireorm.getRepository(Question);
        await questionRepository.create(documents);

        return documents;
      }
    } catch (error: any) {
      console.error('Error in createQuestion:', error);
      throw new Error('Failed to create question');
    }
  }

  async remove(quiz_id: string, question_id: string) {
    try {
      const collection = this.firestore.collection(
        `quizzes/${quiz_id}/Questions`,
      );
      collection.doc(question_id).delete();

      return true;
    } catch (error: any) {
      return false;
    }
  }

  async update(quiz_id: string, question_id: string, updateData: any) {
    try {
      const docRef = this.firestore
        .collection(`quizzes/${quiz_id}/Questions`)
        .doc(question_id);
      await docRef.update(updateData);
      return true;
    } catch (error: any) {
      return false;
    }
  }

  async all(id: string) {
    try {
      const collection = this.firestore.collection(
        `quizzes/${id}/Questions`,
      );
      const snapshot = await collection.get();

      const quizzs: any[] = [];
      snapshot.docs.forEach((doc) => {
        quizzs.push(doc.data());
      });
      return quizzs;
    } catch (error: any) {
      console.error('Error fetching quizzes:', error);
      throw error;
    }
  }

  async getOne(
    cateId: string,
    quesId: string
  ) {
    try {

      const ansRef = this.firestore.collection(`quizzes/${cateId}/Questions/`).doc(quesId);
      const doc = (await ansRef.get()).data();

      return doc;
    } catch (error: any) {
      throw error;
    }
  }
}