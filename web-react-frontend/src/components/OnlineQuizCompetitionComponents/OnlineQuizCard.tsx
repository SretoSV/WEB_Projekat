import { useQuizContext } from "../../context/QuizContext";
import styles from "../../styles/AllQuizzesPagesStyles/StartQuizPageStyle.module.css";
import { useState, useEffect } from "react";
import { setQuizDifficultyText } from "../../services/QuizService";

import { formatTime } from "../../functions/formatTimeFunction";
import { FinishedQuizResult } from "../../components/FinishedQuizResults";
import { useOnlineQuizContext } from "../../context/OnlineQuizContext";
import { OnlineIDontKnow } from "../OnlineUserAnswerOptionsComponents/OnlineIDontKnow";
import { OnlineMultipleChoice } from "../OnlineUserAnswerOptionsComponents/OnlineMultipleChoice";
import { OnlineMultipleCorrectAnswers } from "../OnlineUserAnswerOptionsComponents/OnlineMultipleCorrectAnswers";
import { OnlineTrueFalse } from "../OnlineUserAnswerOptionsComponents/OnlineTrueFalse";
import { OnlineFillInTheBlank } from "../OnlineUserAnswerOptionsComponents/OnlineFillInTheBlank";
interface OnlineQuizCardProps{
    quizId: number;
}
export function OnlineQuizCard({quizId}: OnlineQuizCardProps) {
    const { quizzes, timeLeft } = useQuizContext();
    const { quizResult, setFinishedQuizResult, iDontKnowStates, setIDontKnowStates, currentUserAnswerIndex } = useOnlineQuizContext();

    const [fillInAnswer, setFillInAnswer] = useState<string>("");
    const quiz = quizzes.find(q => q.id === quizId);

    useEffect(() => {
        setFinishedQuizResult(null);
    }, []);

    useEffect(() => {
        //ucitavam u fillInAnswer ono sto je uneto vec pri refreshu
        const answer = quizResult?.answers?.[currentUserAnswerIndex];
        const answerText = answer?.userAnswerOptions?.[0]?.fieldAnswerText ?? "";
        setFillInAnswer(answerText);
    },[currentUserAnswerIndex, quizResult]);

    if(!quiz) return <div>Quiz not found</div>

    return (
        <>
        <div>
            { quizResult === null ? 
            <>
                {   
                    <FinishedQuizResult selectedQuizId={quizId}/>
                }
            </>
            :
            <div className={styles.mainDiv}>
                <div className={styles.timerDiv}>
                    {timeLeft !== null ? formatTime(timeLeft) : "00:00"}
                </div>
                {
                currentUserAnswerIndex === quiz.questions.length ? 
                
                <div className={styles.finishQuizDiv}>
                    Finish quiz?
                </div>
                : 
                <>
                <div className={styles.questionDiv}>
                    <div>Difficulty: {setQuizDifficultyText(quiz.questions[currentUserAnswerIndex].questionDifficultyId)}</div>
                    <div>{(currentUserAnswerIndex + 1) + ". " + quiz.questions[currentUserAnswerIndex].text}</div>
                </div>
                <div className={styles.answersDiv}>

                    <OnlineIDontKnow setIDontKnowStates={setIDontKnowStates} iDontKnowStates={iDontKnowStates} setFillInAnswer={setFillInAnswer}/>
                    
                    { !iDontKnowStates[currentUserAnswerIndex] &&
                        <div>
                            {
                                quiz.questions[currentUserAnswerIndex].questionTypeId === 1
                                && 
                                <OnlineMultipleChoice quizResult={quizResult}/>
                            }
                            {
                                quiz.questions[currentUserAnswerIndex].questionTypeId === 2
                                && 
                                <OnlineMultipleCorrectAnswers quizResult={quizResult}/>
                            }
                            {
                                quiz.questions[currentUserAnswerIndex].questionTypeId === 3
                                && 
                                <OnlineTrueFalse quizResult={quizResult}/>
                            }
                            {
                                quiz.questions[currentUserAnswerIndex].questionTypeId === 4
                                && 
                                <OnlineFillInTheBlank fillInAnswer={fillInAnswer} setFillInAnswer={setFillInAnswer}/>
                            }
                        </div>
                    }



                </div>
                </>
                }

                <div className={styles.bottomDiv}>

                    <div className={styles.questionsDiv}>
                        {Array.from({ length: quiz.questions.length }).map((_, index) => (
                            <button 
                            key={index}
                            className={`${styles.questionNumber} ${currentUserAnswerIndex === index && styles.selectedQuestion}`} 
                            >
                                {index+1}
                            </button>
                        ))}
                    </div>

                </div>

            </div>
            }
        </div>
        </>
    );
}



