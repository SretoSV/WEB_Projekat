import type { Question } from "../models/QuestionModel";
import type { QuizCategory } from "../models/QuizCategoryModel";
import type { Quiz } from "../models/QuizModel";
import { serverPath } from "../serverPath";

export interface FetchQuizzesResponse {
    quizzes: Array<Quiz>;
}

export async function fetchQuizzes(): Promise<FetchQuizzesResponse> {
    //const token = localStorage.getItem('token');

    try {
        /*const response = await fetch(`${serverPath()}/api/Quiz`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Login failed.');
        }*/

        const categories: QuizCategory[] = [{id:1, name:"General Knowledge"}, {id:3, name:"History"}];
        const categories2: QuizCategory[] = [{id:3, name:"History"}];
        const hardcodedQuestions: Question[] = [
            {
            id: 1,
            text: "What is the capital of France?",
            questionTypeId: 1, // npr. 1 = multiple choice
            quizCategoryId: 1,
            quizId: 1,
            answerOptions: [
                { id: 1, text: "Paris", isCorrect: true, questionId: 1 },
                { id: 2, text: "Madrid", isCorrect: false, questionId: 1 },
                { id: 3, text: "Berlin", isCorrect: false, questionId: 1 },
                { id: 4, text: "Rome", isCorrect: false, questionId: 1 }
            ]
            },
            {
            id: 2,
            text: "Which planet is known as the Red Planet?",
            questionTypeId: 1,
            quizCategoryId: 3,
            quizId: 1,
            answerOptions: [
                { id: 5, text: "Mars", isCorrect: true, questionId: 2 },
                { id: 6, text: "Jupiter", isCorrect: false, questionId: 2 },
                { id: 7, text: "Saturn", isCorrect: false, questionId: 2 },
                { id: 8, text: "Venus", isCorrect: false, questionId: 2 }
            ]
            },
            {
            id: 3,
            text: "Who wrote 'Hamlet'?",
            questionTypeId: 1,
            quizCategoryId: 3,
            quizId: 1,
            answerOptions: [
                { id: 9, text: "William Shakespeare", isCorrect: true, questionId: 3 },
                { id: 10, text: "Charles Dickens", isCorrect: false, questionId: 3 },
                { id: 11, text: "Jane Austen", isCorrect: false, questionId: 3 },
                { id: 12, text: "Mark Twain", isCorrect: false, questionId: 3 }
            ]
            }
        ];
        const quizzes: Quiz[] = [
            {
                id: 1,
                title: "Quiz1",
                description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
                categories: categories,
                numberOfQuestions: 10,
                difficulty: "hard",
                timeLimit: 1800,
                questions: hardcodedQuestions,
            },
            {
                id: 2,
                title: "Quiz2",
                description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
                categories: categories2,
                numberOfQuestions: 10,
                difficulty: "hard",
                timeLimit: 22800,
                questions: [],
            }
        ];

        return {
            quizzes,
        };
    } catch (err: any) {
        throw new Error(err.message || 'Server error. Try again later.');
    }

}

export async function editQuiz(quiz: Quiz): Promise<void> {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${serverPath()}/api/Quiz/${quiz.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(quiz),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Failed to edit quiz");
        }
    } catch (err: any) {
        throw new Error(err.message || "Something went wrong while editing the quiz.");
    }
}