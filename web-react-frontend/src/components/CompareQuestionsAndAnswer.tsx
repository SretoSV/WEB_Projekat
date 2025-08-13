import { useQuizContext } from "../context/QuizContext";
import type { UserQuizResult } from "../models/UserQuizResultModel";
import styles from "../styles/AllQuizzesPagesStyles/FinishedQuizResultsStyle.module.css";
interface CompareQuestionAndAnswerProps{
    selectedQuizId: number;
    finishedQuizResult: UserQuizResult;
}

export function CompareQuestionAndAnswer({selectedQuizId, finishedQuizResult}: CompareQuestionAndAnswerProps){
    const { quizzes } = useQuizContext();
    const quiz = quizzes.find(q => q.id === selectedQuizId);
    
    return  <div className={styles.resultsDiv}>
                <div className={styles.rowDivs}>
                    <div>Total Questions: {quiz?.questions.length}</div>
                    <div className={styles.divider}></div>
                    {
                        quiz?.questions.map((answer, index )=> {
                            return <div key={answer.id}>
                                <div className={styles.addPadding}>{(index + 1) + ". " + answer.text}</div>
                                {
                                    answer.answerOptions.map((answerOption) => {
                                        if(answer.questionTypeId === 4){
                                            return <div key={answerOption.id} className={styles.addPadding}>{answerOption.text + " | " + answerOption.fieldAnswerText}</div>
                                        }
                                        else{
                                            return <div key={answerOption.id} className={styles.addPadding}>{answerOption.text + " | " + answerOption?.isCorrect}</div>
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
                        finishedQuizResult?.answers?.map((userAnswer, index)=> {
                            return <div key={userAnswer.id}>
                                <div className={userAnswer.isTrue ? styles.trueQuestionAnswer : styles.wrongQuestionAnswer}>
                                    {(index + 1) + ". " + quiz?.questions[index].text}
                                </div>
                                {
                                    userAnswer?.userAnswerOptions?.map((userAnswerOption, indexOptions) => {
                                        if(userAnswerOption?.isCorrect === quiz?.questions[index].answerOptions[indexOptions]?.isCorrect){
                                            
                                            if(quiz?.questions[index].questionTypeId === 4){
                                                return <div key={userAnswerOption.id} className={styles.addPadding}>{userAnswerOption.text + " | " + (userAnswerOption.fieldAnswerText === null ? "" : userAnswerOption.fieldAnswerText)}</div>
                                            }
                                            else{
                                                return <div key={userAnswerOption.id} className={styles.addPadding}>{userAnswerOption.text + " | " + (userAnswerOption?.isCorrect === null ? "" : userAnswerOption?.isCorrect)}</div>
                                            }
                                        }
                                        else{
                                            if(quiz?.questions[index].questionTypeId === 4){
                                                return <div key={userAnswerOption.id} className={styles.wrongUserAnswer}>{userAnswerOption.text + " | " + (userAnswerOption.fieldAnswerText === null ? "" : userAnswerOption.fieldAnswerText)}</div>
                                            }
                                            else{
                                                return <div key={userAnswerOption.id} className={styles.wrongUserAnswer}>{userAnswerOption.text + " | " + (userAnswerOption?.isCorrect === null ? "" : userAnswerOption?.isCorrect)}</div>
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
}