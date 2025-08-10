import type { Quiz, QuizDto } from "../models/QuizModel";
import type { UserDto } from "../models/UserModel";
import type { UserQuizResult } from "../models/UserQuizResultModel";
import { serverPath } from "../serverPath";
import { subDays } from "date-fns";
import { authFetch } from "./RefreshTokenService";

export interface FetchQuizzesResponse {
    quizzes: Array<Quiz>;
}
export async function fetchQuizzes(): Promise<FetchQuizzesResponse> {
    const res = await authFetch(`${serverPath()}/api/quizzes`);
    if (res.status === 204) return { quizzes: [] };
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Fetching failed.");
    return { quizzes: data };
}

export interface AddQuizResponse {
    addedQuiz: Quiz;
}
export async function addQuiz(quiz: Quiz): Promise<AddQuizResponse> {
    const res = await authFetch(`${serverPath()}/api/quizzes/`, {
        method: "POST",
        body: JSON.stringify(quiz),
    });
    if (!res.ok) throw new Error(await res.text() || "Failed to add quiz");
    return { addedQuiz: await res.json() };
}

export interface EditQuizResponse {
    editedQuiz: Quiz;
}
export async function editQuiz(quiz: Quiz): Promise<EditQuizResponse> {
    const res = await authFetch(`${serverPath()}/api/quizzes/${quiz.id}`, {
        method: "PUT",
        body: JSON.stringify(quiz),
    });
    if (!res.ok) throw new Error(await res.text() || "Failed to edit quiz");
    return { editedQuiz: await res.json() };
}

export interface DeleteQuizResponse {
    deletedQuizId: number;
}
export async function deleteQuiz(quizId: number): Promise<DeleteQuizResponse> {
    const res = await authFetch(`${serverPath()}/api/quizzes/${quizId}`, { method: "DELETE" });
    if (!res.ok) throw new Error(await res.text() || "Failed to delete quiz");
    return { deletedQuizId: quizId };
}

export interface StartQuizResponse {
    startedUserQuizResult: UserQuizResult;
}
export async function startQuizFetch(quizId: number): Promise<StartQuizResponse> {
    const res = await authFetch(`${serverPath()}/api/quizzes/${quizId}/attempts`, { method: "POST" });
    if (!res.ok) throw new Error(await res.text() || "Failed to start quiz");
    return { startedUserQuizResult: await res.json() };
}

export interface FinishQuizResponse {
    returnedQuizResult: UserQuizResult;
}
export async function finishQuizFetch(quizResult: UserQuizResult): Promise<FinishQuizResponse> {
    const res = await authFetch(`${serverPath()}/api/quizzes/attempts/${quizResult.id}`, {
        method: "PUT",
        body: JSON.stringify(quizResult),
    });
    if (!res.ok) throw new Error(await res.text() || "Failed to finish quiz");
    return { returnedQuizResult: await res.json() };
}

export interface FetchUserQuizzesResponse {
    quizzes: Array<QuizDto>;
}
export async function fetchQuizzesByUserUsername(username: string): Promise<FetchUserQuizzesResponse> {
    if (!username) return { quizzes: [] };
    const res = await authFetch(`${serverPath()}/api/quizzes/${username}`);
    if (res.status === 204) return { quizzes: [] };
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Fetching failed.");
    return { quizzes: data };
}

export interface FetchQuizResultsByUserUsernameAndQuizIdResponse {
    results: Array<UserQuizResult>;
}
export async function fetchQuizResultsByUserUsernameAndQuizId(username: string, quizId: number): Promise<FetchQuizResultsByUserUsernameAndQuizIdResponse> {
    if (!username || quizId <= 0) return { results: [] };
    const res = await authFetch(`${serverPath()}/api/quizzes/${quizId}/${username}`);
    if (res.status === 204) return { results: [] };
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Fetching failed.");
    return { results: data };
}

export interface FetchQuizResultsByQuizIdResponse {
    results: Array<UserQuizResult>;
    profiles: Array<UserDto>;
}
export async function fetchQuizResultsQuizId(quizId: number): Promise<FetchQuizResultsByQuizIdResponse> {
    if (quizId <= 0) return { results: [], profiles: [] };
    const res = await authFetch(`${serverPath()}/api/quizzes/results/${quizId}`);
    if (res.status === 204) return { results: [], profiles: [] };
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Fetching failed.");
    return { results: data.results, profiles: data.profiles };
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

export function formatDateTime(dateString?: string): string {
    if (!dateString) return "N/A";

    const date = new Date(dateString);
    return date.toLocaleString("sr-RS", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
}

export function filterResultsByPeriod(allResults: UserQuizResult[], period: string): UserQuizResult[]{
    if (period === "") return allResults;

    const now = new Date();
    let thresholdDate: Date;

    if (period === "Weekly") {
        thresholdDate = subDays(now, 7);
    } else if (period === "Monthly") {
        thresholdDate = subDays(now, 30);
    } else {
        return allResults;
    }

    return allResults.filter(r => new Date(r.startedAt) >= thresholdDate);
};

/*
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
            throw new Error(data.message || 'Fetching failed.');
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


export interface FetchUserQuizzesResponse {
    quizzes: Array<QuizDto>;
}

export async function fetchQuizzesByUserUsername(username: string): Promise<FetchUserQuizzesResponse> {
    const token = localStorage.getItem('token');

    try {
        if(username !== ""){
            const response = await fetch(`${serverPath()}/api/quizzes/${username}`, {
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
                throw new Error(data.message || 'Fetching failed.');
            }
        
            return {
                quizzes: data,
            };
        }
        else{
            return {
                quizzes: [],
            };
        }
    } catch (err: any) {
        throw new Error(err.message || 'Server error. Try again later.');
    }

}

export interface FetchQuizResultsByUserUsernameAndQuizIdResponse {
    results: Array<UserQuizResult>;
}

export async function fetchQuizResultsByUserUsernameAndQuizId(username: string, quizId: number): Promise<FetchQuizResultsByUserUsernameAndQuizIdResponse> {
    const token = localStorage.getItem('token');

    try {
        if(username !== "" && quizId > 0){
            const response = await fetch(`${serverPath()}/api/quizzes/${quizId}/${username}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (response.status === 204) {
                return { results: [] };
            }
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Fetching failed.');
            }
        
            return {
                results: data,
            };
        }
        else{
            return {
                results: [],
            };
        }
    } catch (err: any) {
        throw new Error(err.message || 'Server error. Try again later.');
    }

}

export interface FetchQuizResultsByQuizIdResponse {
    results: Array<UserQuizResult>;
    profiles: Array<UserDto>;
}

export async function fetchQuizResultsQuizId(quizId: number): Promise<FetchQuizResultsByQuizIdResponse> {
    const token = localStorage.getItem('token');

    try {
        if(quizId > 0){
            const response = await fetch(`${serverPath()}/api/quizzes/results/${quizId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (response.status === 204) {
                return { results: [], profiles: [] };
            }
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Fetching failed.');
            }
        
            return {
                results: data.results,
                profiles: data.profiles,
            };
        }
        else{
            return {
                results: [],
                profiles: [],
            };
        }
    } catch (err: any) {
        throw new Error(err.message || 'Server error. Try again later.');
    }

}
*/
