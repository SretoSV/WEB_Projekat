import type { Quiz } from "../models/QuizModel";
import type { UserQuizResult } from "../models/UserQuizResultModel";
import { serverPath } from "../serverPath";

export interface FetchQuizzesResponse {
    quizzes: Array<Quiz>;
}

export async function fetchQuizzes(): Promise<FetchQuizzesResponse> {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${serverPath()}/api/quizzes`, {
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
        const response = await fetch(`${serverPath()}/api/quizzes/`, {
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
        const response = await fetch(`${serverPath()}/api/quizzes/${quiz.id}`, {
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
        const response = await fetch(`${serverPath()}/api/quizzes/${quizId}`, {
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

export async function startQuizFetch(quizId: number): Promise<StartQuizResponse> {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${serverPath()}/api/quizzes/${quizId}/attempts`, {
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


export interface FinishQuizResponse {
    returnedQuizResult: UserQuizResult;
}

export async function finishQuizFetch(quizResult: UserQuizResult): Promise<FinishQuizResponse> {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${serverPath()}/api/quizzes/attempts/${quizResult.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(quizResult),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Failed to finish quiz");
        }

        const data = await response.json();

        return {
            returnedQuizResult: data,
        };

    } catch (err: any) {
        throw new Error(err.message || "Something went wrong while finishing the quiz.");
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

//UserAnswerOptions Functions

export function onChangeIDontKnowCheckbox(
    isChecked :boolean, 
    currentUserAnswerIndex: number, 
    setIDontKnowStates: React.Dispatch<React.SetStateAction<boolean[]>>,
    setFillInAnswer: React.Dispatch<React.SetStateAction<string>>,
    setQuizResult: React.Dispatch<React.SetStateAction<UserQuizResult | null>>
) {
    setIDontKnowStates(prev => {
        const updated = [...prev];
        updated[currentUserAnswerIndex] = isChecked;
        return updated;
    });

    if (isChecked) {
        setQuizResult(prev => {
            if (!prev || !prev.answers) return prev;
            const updatedAnswers = [...prev.answers];
            updatedAnswers[currentUserAnswerIndex] = {
                ...updatedAnswers[currentUserAnswerIndex],
                userAnswerOptions: updatedAnswers[currentUserAnswerIndex]?.userAnswerOptions?.map(opt => ({
                    ...opt,
                    isCorrect: null,
                    fieldAnswerText: null
                }))
            };
            return { ...prev, answers: updatedAnswers };
        });
        setFillInAnswer("");
    }
}

export function onChangeMultipleChoice(
    setQuizResult: React.Dispatch<React.SetStateAction<UserQuizResult | null>>,
    currentUserAnswerIndex: number, 
    index: number,
) {
    setQuizResult(prev => {
        if (!prev || !prev.answers) return prev;
        const updatedAnswers = [...prev.answers];
        const newOptions = updatedAnswers[currentUserAnswerIndex]?.userAnswerOptions?.map((opt, i) => ({
        ...opt,
        isCorrect: i === index
        }));
        updatedAnswers[currentUserAnswerIndex] = {
            ...updatedAnswers[currentUserAnswerIndex],
            userAnswerOptions: newOptions
        };
        return { ...prev, answers: updatedAnswers };
    });
}

export function onChangMultipleCorrectAnswers(
    setQuizResult: React.Dispatch<React.SetStateAction<UserQuizResult | null>>,
    currentUserAnswerIndex: number, 
    index: number,
    isChecked: boolean,
) {
    setQuizResult(prev => {
        if (!prev || !prev.answers) return prev;
        const updatedAnswers = [...prev.answers];
        const currentAnswer = updatedAnswers[currentUserAnswerIndex];

        if (!currentAnswer || !currentAnswer.userAnswerOptions) return prev;

        const updatedOptions = [...currentAnswer.userAnswerOptions];
        updatedOptions[index] = {
            ...updatedOptions[index],
            isCorrect: isChecked
        };

        updatedAnswers[currentUserAnswerIndex] = {
            ...currentAnswer,
            userAnswerOptions: updatedOptions
        };

        return { ...prev, answers: updatedAnswers };
    });
}

export function onChangTrueFalse(
    setQuizResult: React.Dispatch<React.SetStateAction<UserQuizResult | null>>,
    currentUserAnswerIndex: number, 
    option: boolean,
) {
    setQuizResult(prev => {
        if (!prev || !prev.answers) return prev;
        const updatedAnswers = [...prev.answers];
        updatedAnswers[currentUserAnswerIndex] = {
            ...updatedAnswers[currentUserAnswerIndex],
            userAnswerOptions: updatedAnswers[currentUserAnswerIndex]?.userAnswerOptions?.map(opt => ({
                ...opt,
                isCorrect: option
            }))
        };
        return { ...prev, answers: updatedAnswers };
    });
}

export function onChangFillInTheBlank(
    setQuizResult: React.Dispatch<React.SetStateAction<UserQuizResult | null>>,
    currentUserAnswerIndex: number, 
    newValue: string,
) {
    setQuizResult(prev => {
        if (!prev || !prev.answers) return prev;
        const updatedAnswers = [...prev.answers];
        updatedAnswers[currentUserAnswerIndex] = {
            ...updatedAnswers[currentUserAnswerIndex],
            userAnswerOptions: updatedAnswers[currentUserAnswerIndex]?.userAnswerOptions?.map(opt => ({
                ...opt,
                isCorrect: false,
                fieldAnswerText: newValue
            }))
        };
        return { ...prev, answers: updatedAnswers };
    });
}

