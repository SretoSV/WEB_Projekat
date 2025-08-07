import { useEffect } from "react";
import { useQuizContext } from "../context/QuizContext";
import styles from "../styles/AllQuizzesPagesStyles/FinishedQuizResultsStyle.module.css";
import ButtonWithText from "./ButtonWithText";
import ButtonWithLongText from "./ButtonWithLongText";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { CompareQuestionAndAnswer } from "./CompareQuestionsAndAnswer";

interface FinishedQuizResultProps{
    selectedQuizId: number;
}
export function FinishedQuizResult({selectedQuizId}: FinishedQuizResultProps){
    const { user } = useUserContext();
    const { finishedQuizResult, setFinishedQuizResult } = useQuizContext(); 
    const navigate = useNavigate();

    useEffect(()=>{
        console.log(finishedQuizResult);
        console.log(selectedQuizId);
    },[]);

    const handleNavigate = () => {
        setFinishedQuizResult(null);
        if(user){
            if(user.isAdmin){
                navigate('../AdminAllQuizzesPage');
            }
            else{
                navigate('../UserAllQuizzesPage');
            }
        }
    }
    return <>
        <div className={styles.mainDiv}>
            <div className={styles.scoreText}>Score</div>
            <div className={styles.precentageText}>{finishedQuizResult?.scorePercentage}%</div>
            
            {finishedQuizResult &&
            <CompareQuestionAndAnswer selectedQuizId={selectedQuizId} finishedQuizResult={finishedQuizResult}/>}

            <div className={styles.buttonsDiv}>
                <ButtonWithText type="button" text="Try Again" onClick={() => setFinishedQuizResult(null)}/>
                <ButtonWithLongText type="button" text="Quiz page" onClick={handleNavigate}/>
            </div>
        </div>
    </>
}