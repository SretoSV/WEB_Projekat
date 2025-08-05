import { useEffect } from "react";
import { useQuizContext } from "../context/QuizContext";
import type { Quiz } from "../models/QuizModel";
import styles from "../styles/AllQuizzesPagesStyles/FinishedQuizResultsStyle.module.css";
import ButtonWithText from "./ButtonWithText";
import ButtonWithLongText from "./ButtonWithLongText";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";

interface FinishedQuizResultProps{
    quiz: Quiz;
}
export function FinishedQuizResult({quiz}: FinishedQuizResultProps){
    const { user } = useUserContext();
    const { finishedQuizResult, setFinishedQuizResult } = useQuizContext(); 
    const navigate = useNavigate();

    useEffect(()=>{
        console.log(finishedQuizResult);
        console.log(quiz);
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
            <div className={styles.resultsDiv}>
                <div className={styles.rowDivs}>
                    <div>Total Questions: {quiz.questions.length}</div>
                    <div className={styles.divider}></div>
                    {
                        quiz.questions.map((answer, index )=> {
                            return <div key={answer.id}>
                                <div className={styles.addPadding}>{(index + 1) + ". " + answer.text}</div>
                                {
                                    answer.answerOptions.map((answerOption) => {
                                        if(answer.questionTypeId === 4){
                                            return <div key={answerOption.id} className={styles.addPadding}>{answerOption.text + " | " + answerOption.fieldAnswerText}</div>
                                        }
                                        else{
                                            return <div key={answerOption.id} className={styles.addPadding}>{answerOption.text + " | " + answerOption.isCorrect}</div>
                                        }
                                    })
                                }
                                <br />
                            </div>
                        })
                    }
                </div>
                <div className={`${styles.rowDivs} ${styles.rowDiv2}`}>
                    <div>Correct Answers: {finishedQuizResult?.correctAnswers}</div>
                    <div className={styles.divider}></div>
                    {
                        finishedQuizResult?.answers?.map((userAnswer, index )=> {
                            return <div key={userAnswer.id}>
                                <div className={userAnswer.isTrue ? styles.trueQuestionAnswer : styles.wrongQuestionAnswer}>
                                    {(index + 1) + ". " + quiz.questions[index].text}
                                </div>
                                {
                                    userAnswer?.userAnswerOptions?.map((userAnswerOption, indexOptions) => {
                                        if(userAnswerOption?.isCorrect === quiz.questions[index].answerOptions[indexOptions].isCorrect){
                                            
                                            if(quiz.questions[index].questionTypeId === 4){
                                                return <div key={userAnswerOption.id} className={styles.addPadding}>{userAnswerOption.text + " | " + userAnswerOption.fieldAnswerText}</div>
                                            }
                                            else{
                                                return <div key={userAnswerOption.id} className={styles.addPadding}>{userAnswerOption.text + " | " + userAnswerOption.isCorrect}</div>
                                            }
                                        }
                                        else{
                                            if(quiz.questions[index].questionTypeId === 4){
                                                return <div key={userAnswerOption.id} className={styles.wrongUserAnswer}>{userAnswerOption.text + " | " + userAnswerOption.fieldAnswerText}</div>
                                            }
                                            else{
                                                return <div key={userAnswerOption.id} className={styles.wrongUserAnswer}>{userAnswerOption.text + " | " + userAnswerOption.isCorrect}</div>
                                            }
                                        }
                                    })
                                }
                                <br />
                            </div>
                        })
                    }
                </div>
            </div>
            <div className={styles.buttonsDiv}>
                <ButtonWithText type="button" text="Try Again" onClick={() => setFinishedQuizResult(null)}/>
                <ButtonWithLongText type="button" text="Quiz page" onClick={handleNavigate}/>
            </div>
        </div>
    </>
}