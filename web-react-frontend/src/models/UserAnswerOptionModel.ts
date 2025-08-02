export interface UserAnswerOption{
    id: number,
    text: string,
    isCorrect?: boolean | null,
    fieldAnswerText?: string | null,
    userAnswerId: number,
}