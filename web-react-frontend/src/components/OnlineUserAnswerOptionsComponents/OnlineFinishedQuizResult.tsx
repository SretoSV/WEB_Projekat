import { useEffect } from "react";
import styles from "../../styles/AllQuizzesPagesStyles/FinishedQuizResultsStyle.module.css";
import { useNavigate } from "react-router-dom";
import ButtonWithLongText from "../ButtonWithLongText";
import { CompareQuestionAndAnswer } from "../CompareQuestionsAndAnswer";
import { useOnlineQuizContext } from "../../context/OnlineQuizContext";

interface FinishedQuizResultProps{
    selectedQuizId: number;
}
export function OnlineFinishedQuizResult({selectedQuizId}: FinishedQuizResultProps){
    const { finishedQuizResult, setFinishedQuizResult } = useOnlineQuizContext(); 
    const navigate = useNavigate();

    useEffect(()=>{
        console.log(finishedQuizResult);
        console.log(selectedQuizId);
    },[]);

    const handleNavigate = () => {
        setFinishedQuizResult(null);
        navigate('../OnlineQuizCompetition');
    }
    return <>
        <div className={styles.mainDiv}>
            <div className={styles.scoreText}>Score</div>
            <div className={styles.precentageText}>{finishedQuizResult?.scorePercentage}%</div>
            
            {finishedQuizResult &&
            <CompareQuestionAndAnswer selectedQuizId={selectedQuizId} finishedQuizResult={finishedQuizResult}/>}

            <div className={styles.buttonsDiv}>
                <ButtonWithLongText type="button" text="Go back to rooms" onClick={handleNavigate}/>
            </div>
        </div>
    </>
}