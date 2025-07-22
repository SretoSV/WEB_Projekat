import type { Question } from "./QuestionModel";
import type { QuizCategory } from "./QuizCategoryModel";

export interface Quiz {
  id: number;
  title: string;
  description: string;
  categories: Array<QuizCategory>;
  questions: Array<Question>;
  numberOfQuestions: number;
  difficulty: string;
  timeLimit: number;
}
