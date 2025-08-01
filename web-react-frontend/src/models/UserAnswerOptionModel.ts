export interface UserAnswerOption{
    id: number,
    text: string,
    isCorrect?: boolean,
    fieldAnswerText?: string,
    userAnswerId: number,
}