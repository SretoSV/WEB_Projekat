import type { Question } from "./QuestionModel";
import type { QuizCategory } from "./QuizCategoryModel";
import type { UserQuizResult } from "./UserQuizResultModel";

export interface Quiz {
  id: number;
  title: string;
  description: string;
  timeLimitSeconds: number;
  allQuizCategories: Array<QuizCategory>;
  questions: Array<Question>;
  quizDifficultyId: number;
  results: Array<UserQuizResult>;
}

export interface QuizDto {
  id: number;
  title: string;
}
