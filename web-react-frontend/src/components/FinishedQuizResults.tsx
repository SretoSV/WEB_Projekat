import { useEffect } from "react";
import { useQuizContext } from "../context/QuizContext";
import type { Quiz } from "../models/QuizModel";
interface FinishedQuizResultProps{
    quiz: Quiz;
}
export function FinishedQuizResult({quiz}: FinishedQuizResultProps){
    const { finishedQuizResult } = useQuizContext(); 

    useEffect(()=>{
        console.log(finishedQuizResult);
        console.log(quiz);
    },[]);
    return <>
        FinishedQuizResult {finishedQuizResult?.id +" | "+ quiz.id}
    </>
}