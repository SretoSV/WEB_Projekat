import { useParams } from "react-router-dom";
import { useQuizContext } from "../../context/QuizContext";
import { Navigation } from "../../components/Navigation";
import styles from "../../styles/AllQuizzesPagesStyles/StartQuizPageStyle.module.css";
import { useState } from "react";
import type { UserQuizResult } from "../../models/UserQuizResultModel";
import { startQuiz } from "../../services/QuizService";
import { StartQuizInfo } from "../../components/StartQuizInfo";

export function StartQuizPage() {
    const { quizId } = useParams();
    const { quizzes } = useQuizContext();
    const [currentUserQuizResult, setCurrentUserQuizResult] = useState<UserQuizResult | null>(null);
    
    const quiz = quizzes.find(q => q.id === parseInt(quizId ?? "0"));
    if(!quiz) return <div>Quiz not found</div>


    const handleStartQuiz = async () => {
        console.log("startuj");
        try {
            const quizIdNumber = parseInt(quizId ?? "0");
            const { startedUserQuizResult } = await startQuiz(quizIdNumber);
            console.log("KKKKKKOOOOONJ: " + startedUserQuizResult.id);
            setCurrentUserQuizResult(startedUserQuizResult);
        } catch (err) {
            alert("Error starting quiz!");
        }
    }

    return (
        <>
        <Navigation />
        <div>
            { currentUserQuizResult === null ? 
                <StartQuizInfo quiz={quiz} onStartQuiz={handleStartQuiz}/>
            :
            <div className={styles.mainDiv}>
                STARTOVANO
            </div>
            }
        </div>
        </>
    );
}