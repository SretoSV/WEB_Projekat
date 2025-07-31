import type { AnswerOption } from "./AnswerOptionModel";

export interface Question {
  id: number;
  text: string;
  questionTypeId: number;
  quizCategoryId: number;
  questionDifficultyId: number;
  quizId: number;
  answerOptions: Array<AnswerOption>;
}
