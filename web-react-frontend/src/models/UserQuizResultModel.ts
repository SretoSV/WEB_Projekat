import type { UserAnswer } from "./UserAnswerModel";

export interface UserQuizResult{
    id: number,
    userId: number,
    quizId: number,
    totalQuestions?: number,
    correctAnswers?: number,
    scorePercentage?: number,
    startedAt: Date,
    submittedAt?: Date,
    isStarted: boolean,
    answers?: Array<UserAnswer>,
    gameRoomId?: number,
}