import * as _ from 'lodash';
import { Question } from '../collections/questions.collection';

export class QuestionMapper {
  static toQuestionMapper = (collection: Question) => ({
    name: _.get(collection, 'name'),
    explain: _.get(collection, 'explain'),
  });
}