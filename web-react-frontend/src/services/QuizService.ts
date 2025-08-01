import type { Quiz } from "../models/QuizModel";
import type { UserQuizResult } from "../models/UserQuizResultModel";
import { serverPath } from "../serverPath";

export interface FetchQuizzesResponse {
    quizzes: Array<Quiz>;
}

export async function fetchQuizzes(): Promise<FetchQuizzesResponse> {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${serverPath()}/api/Quiz`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });

        if (response.status === 204) {
            return { quizzes: [] };
        }
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Login failed.');
        }

       return {
            quizzes: data,
        };

    } catch (err: any) {
        throw new Error(err.message || 'Server error. Try again later.');
    }

}

export interface AddQuizResponse {
    addedQuiz: Quiz;
}

export async function addQuiz(quiz: Quiz): Promise<AddQuizResponse> {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${serverPath()}/api/Quiz/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(quiz),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Failed to add quiz");
        }

        const data = await response.json();

        return {
            addedQuiz: data,
        };

    } catch (err: any) {
        throw new Error(err.message || "Something went wrong while adding the quiz.");
    }
}

export interface EditQuizResponse {
    editedQuiz: Quiz;
}

export async function editQuiz(quiz: Quiz): Promise<EditQuizResponse> {
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

        const data = await response.json();

        return {
            editedQuiz: data,
        };

    } catch (err: any) {
        throw new Error(err.message || "Something went wrong while editing the quiz.");
    }
}

export interface DeleteQuizResponse {
    deletedQuizId: number;
}

export async function deleteQuiz(quizId: number): Promise<DeleteQuizResponse> {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${serverPath()}/api/Quiz/${quizId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Failed to delete quiz");
        }

        return {
            deletedQuizId: quizId,
        };

    } catch (err: any) {
        throw new Error(err.message || "Something went wrong while deleting the quiz.");
    }
}

export interface StartQuizResponse {
    startedUserQuizResult: UserQuizResult;
}

export async function startQuiz(quizId: number): Promise<StartQuizResponse> {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${serverPath()}/api/Quiz/start/${quizId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Failed to start quiz");
        }

        const data = await response.json();

        return {
            startedUserQuizResult: data,
        };

    } catch (err: any) {
        throw new Error(err.message || "Something went wrong while starting the quiz.");
    }
}

export function setQuizDifficultyText(
  quizDifficultyId: number
): string {
    switch(quizDifficultyId){
        case 1:
            return "easy";
        case 2:
            return "medium";
        case 3:
            return "hard";

    }
    return "";
}