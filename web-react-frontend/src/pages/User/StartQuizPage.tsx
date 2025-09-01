import { useNavigate, useParams } from "react-router-dom";
import { useQuizContext } from "../../context/QuizContext";
import styles from "../../styles/AllQuizzesPagesStyles/StartQuizPageStyle.module.css";
import { useState, useEffect } from "react";
import { setQuizDifficultyText, startQuizFetch } from "../../services/QuizService";
import { StartQuizInfo } from "../../components/StartQuizInfo";
import ButtonWithText from "../../components/ButtonWithText";
import { formatTime } from "../../functions/formatTimeFunction";
import { FinishedQuizResult } from "../../components/FinishedQuizResults";
import { IDontKnow } from "../../components/UserAnswerOptionsComponents/IDontKnow";
import { MultipleChoice } from "../../components/UserAnswerOptionsComponents/MultipleChoice";
import { MultipleCorrectAnswers } from "../../components/UserAnswerOptionsComponents/MultipleCorrectAnswers";
import { TrueFalse } from "../../components/UserAnswerOptionsComponents/TrueFalse";
import { FillInTheBlank } from "../../components/UserAnswerOptionsComponents/FillInTheBlank";
import { useUserContext } from "../../context/UserContext";

export function StartQuizPage() {
    const { user, handleLogout } = useUserContext();
    const navigate = useNavigate();
    const { quizId } = useParams();
    const { quizzes, quizResult, startQuiz, setFinishedQuizResult,iDontKnowStates, setIDontKnowStates, currentUserAnswerIndex, timeLeft, restoreTimer, initializeTimer, handleSetIndex, finishQuiz, incrementIndex, decrementIndex, finishedQuizResult } = useQuizContext();

    const [fillInAnswer, setFillInAnswer] = useState<string>("");
    const quiz = quizzes.find(q => q.id === parseInt(quizId ?? "0"));

    useEffect(() => {
        setFinishedQuizResult(null);
    }, []);

    useEffect(() => {
        //ucitavam u fillInAnswer ono sto je uneto vec pri refreshu
        const answer = quizResult?.answers?.[currentUserAnswerIndex];
        const answerText = answer?.userAnswerOptions?.[0]?.fieldAnswerText ?? "";
        setFillInAnswer(answerText);
    },[currentUserAnswerIndex, quizResult]);

    useEffect(() => {
        if (quizResult && quiz?.timeLimitSeconds && timeLeft === null) {
            restoreTimer(quiz.timeLimitSeconds);
        }
    }, [quizResult, quiz?.timeLimitSeconds]);

    useEffect(() => {
        if(!localStorage.getItem('user')){
            navigate("../Login");
        }
    }, [user]);

    useEffect(() => {
        if (quizResult) {
            navigate(`/StartQuizPage/${quizResult.quizId}`, { replace: true });
        }
    }, [quizResult]);

    const handleStartQuiz = async () => {
        
        try {
            const quizIdNumber = parseInt(quizId ?? "0");
            const { startedUserQuizResult } = await startQuizFetch(quizIdNumber, handleLogout);
            
            initializeTimer(quiz?.timeLimitSeconds || 0);

            startQuiz(startedUserQuizResult);
        } catch (err: any) {
            throw new Error(err);
        }
    }

    if(!quiz) return <div>Quiz not found</div>

    return (
        <>
        <div>
            { quizResult === null ? 
            <>
                {   finishedQuizResult === null ? 
                    <StartQuizInfo quiz={quiz} onStartQuiz={handleStartQuiz}/>
                    :
                    quizId && <FinishedQuizResult selectedQuizId={parseInt(quizId)}/>
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

                    <IDontKnow setIDontKnowStates={setIDontKnowStates} iDontKnowStates={iDontKnowStates} setFillInAnswer={setFillInAnswer}/>
                    
                    { !iDontKnowStates[currentUserAnswerIndex] &&
                        <div>
                            {
                                quiz.questions[currentUserAnswerIndex].questionTypeId === 1
                                && 
                                <MultipleChoice quizResult={quizResult}/>
                            }
                            {
                                quiz.questions[currentUserAnswerIndex].questionTypeId === 2
                                && 
                                <MultipleCorrectAnswers quizResult={quizResult}/>
                            }
                            {
                                quiz.questions[currentUserAnswerIndex].questionTypeId === 3
                                && 
                                <TrueFalse quizResult={quizResult}/>
                            }
                            {
                                quiz.questions[currentUserAnswerIndex].questionTypeId === 4
                                && 
                                <FillInTheBlank fillInAnswer={fillInAnswer} setFillInAnswer={setFillInAnswer}/>
                            }
                        </div>
                    }



                </div>
                </>
                }

                <div className={styles.bottomDiv}>
                    {currentUserAnswerIndex > 0 ?
                        <div className={styles.backButtonDiv}><ButtonWithText onClick={decrementIndex} text="Back"/></div>
                        :
                        <div className={styles.backButtonDiv}><ButtonWithText text="/"/></div>
                    }
                    <div className={styles.questionsDiv}>
                        {Array.from({ length: quiz.questions.length }).map((_, index) => (
                            <button 
                            key={index}
                            onClick={() => handleSetIndex(index)}
                            className={`${styles.questionNumber} ${currentUserAnswerIndex === index && styles.selectedQuestion}`} 
                            >
                                {index+1}
                            </button>
                        ))}
                    </div>
                    {
                    currentUserAnswerIndex === quiz.questions.length ? 
                    <div className={styles.nextButtonDiv}><ButtonWithText onClick={finishQuiz} text="Finish"/></div>
                    :
                    <>
                    {currentUserAnswerIndex !== (quiz.questions.length - 1) ?
                        <div className={styles.nextButtonDiv}><ButtonWithText onClick={incrementIndex} text="Next"/></div>
                        :
                        <div className={styles.nextButtonDiv}><ButtonWithText onClick={incrementIndex} text="Finish"/></div>
                    }
                    </>
                    }
                </div>

            </div>
            }
        </div>
        </>
    );
}



