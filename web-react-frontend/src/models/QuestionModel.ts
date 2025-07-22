import type { AnswerOption } from "./AnswerOptionModel";

export interface Question {
  id: number;
  text: string;
  questionTypeId: number;
  quizCategoryId: number;
  quizId: number;
  answerOptions: Array<AnswerOption>;
}
