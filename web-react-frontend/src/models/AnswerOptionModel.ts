export interface AnswerOption {
  id: number;
  text: string;
  isCorrect: boolean;
  questionId: number;
  fieldAnswerText?: string;
}

/*

  const emptyQuestion: Question = {
  id: 0,
  text: "",
  quizId: 0,
  quizCategoryId: 0,
  questionTypeId: 0,
  answerOptions: [],
};
*/