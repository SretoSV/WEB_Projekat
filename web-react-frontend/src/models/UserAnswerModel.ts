import type { UserAnswerOption } from "./UserAnswerOptionModel";

export interface UserAnswer{
    id: number,
    quizId: number,
    resultId: number,
    questionId: number,
    userId: string,
    userAnswerOptions?: Array<UserAnswerOption>;
}