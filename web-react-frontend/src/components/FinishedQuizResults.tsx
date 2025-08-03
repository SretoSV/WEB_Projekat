import { useQuizContext } from "../context/QuizContext";

export function FinishedQuizResult(){
    const { finishedQuizResult } = useQuizContext(); 

    return <>
        FinishedQuizResult {finishedQuizResult?.id}
    </>
}