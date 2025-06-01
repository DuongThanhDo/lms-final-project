import { Inject, Injectable } from '@nestjs/common';
import { Firestore } from 'firebase-admin/firestore';
import * as fireorm from 'fireorm';
import { Quiz } from '../collections/quiz.collection';
import { QuizMapper } from '../mappers/quiz.mapper';
import { log } from 'console';

@Injectable()
export class QuizService {
  constructor(
    @Inject('FIREBASE_ADMIN')
    private firestore: Firestore,
    @Inject('Quiz')
    private quiz: Quiz,
  ) {
    fireorm.initialize(this.firestore);
  }

  async createQuiz(data: any) {
    try {
      const { id, body } = data;

      console.log(body);

      const documents = {
        id,
        ...QuizMapper.toQuizMapper({
          ...body,
        }),
      };

      this.quiz = documents;
      console.log('Them quiz' + documents);

      const quizRepository = fireorm.getRepository(Quiz);
      const newQuiz = await quizRepository.create(this.quiz);
      console.log('new quiz' + newQuiz + 'repon' + quizRepository);
      return newQuiz.id;
    } catch (error: any) {
      console.error();
    }
  }

  static collectData: {};

  convertData(data: any) {
    const quizzs = data.quizzs;
    const result = Object.keys(quizzs).map((quizId) => {
      const quiz = quizzs[quizId];
      const questions = Object.keys(quiz.Questions).map((questionId, index) => {
        const question = quiz.Questions[questionId][questionId];
        const answers = Object.keys(question.Answers).map((answerId) => {
          const answer = question.Answers[answerId][answerId];
          return {
            id: answer.id,
            value: answer.value,
          };
        });

        return {
          id: question.id,
          name: question.name,
          type: question.type,
          answers: answers,
          results: question.results,
          explain: question.explain,
        };
      });

      return {
        id: quiz.id,
        name: quiz.name,
        questions: questions,
      };
    });

    return result;
  }

  async get(
    id: string,
    nameCollection: string,
    pathCollect = '',
    data: any = {},
  ) {
    try {
      const path: string = pathCollect + nameCollection + '/';
      const collectData = { ...data };

      const collection = this.firestore.collection(path);
      const docRef = collection.doc(id);

      const docSnapshot = await docRef.get();
      if (!docSnapshot.exists) return collectData;

      const docData = docSnapshot.data();
      collectData[nameCollection] = {
        [id]: docData || {},
      };

      const subCollections = await docRef.listCollections();
      for (const subCollection of subCollections) {
        const subCollectionData: any = {};

        const documents = await subCollection.listDocuments();
        for (const document of documents) {
          const subDocData = await this.get(
            document.id,
            subCollection.id,
            path + id + '/',
            {},
          );
          subCollectionData[document.id] = subDocData[subCollection.id];
        }

        collectData[nameCollection][id][subCollection.id] = subCollectionData;
      }

      return collectData;
    } catch (error: any) {
      console.error('Error fetching subcollections:', error);
      throw error;
    }
  }

  async all() {
    try {
      const collection = this.firestore.collection('quizzs');
      const snapshot = await collection.get();

      const quizzs: any[] = [];
      snapshot.docs.forEach((doc) => {
        quizzs.push(doc.data());
      });
      return quizzs;
    } catch (error: any) {
      console.error('Error fetching quizzs:', error);
      throw error;
    }
  }

  async delete(id: string) {
    try {
      const quizRepository = fireorm.getRepository(Quiz);
      quizRepository.delete(id);
    } catch (error: any) {
      throw error;
    }
  }

  async update(id: string, data: any) {
    try {
      const documents = QuizMapper.toQuizMapper({
        ...data,
      });

      const quizRepository = fireorm.getRepository(Quiz);

      let quiz: Quiz = await quizRepository.findById(id);

      const newQuizDocs: Quiz = {
        id,
        ...documents,
      };

      quiz = newQuizDocs;

      quizRepository.update(quiz);
    } catch (error: any) {
      throw error;
    }
  }

  async getOne(id: string) {
    try {
      const quizRepository = fireorm.getRepository(Quiz);

      let quiz: Quiz = await quizRepository.findById(id);
      return {
        id: quiz.id,
        name: quiz.name,
      };
    } catch (error: any) {
      throw error;
    }
  }
}
