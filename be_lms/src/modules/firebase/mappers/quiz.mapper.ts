import * as _ from 'lodash';
import { Quiz } from '../collections/quiz.collection';

export class QuizMapper {
  static toQuizMapper = (collection: Quiz) => ({
    name: _.get(collection, 'name'),
    
  });
}