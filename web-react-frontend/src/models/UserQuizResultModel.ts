import type { UserAnswer } from "./UserAnswerModel";

export interface UserQuizResult{
    id: number,
    userId: number,
    quizId: number,
    totalQuestions: number,
    correctAnswers: number,
    scorePercentage: number,
    submittedAt: Date,
    durationSeconds: number,
    answers: Array<UserAnswer>,
}