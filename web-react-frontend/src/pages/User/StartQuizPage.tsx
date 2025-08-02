import { useParams } from "react-router-dom";
import { useQuizContext } from "../../context/QuizContext";
import { Navigation } from "../../components/Navigation";
import styles from "../../styles/AllQuizzesPagesStyles/StartQuizPageStyle.module.css";
import { useState } from "react";
import { setQuizDifficultyText, startQuizFetch } from "../../services/QuizService";
import { StartQuizInfo } from "../../components/StartQuizInfo";
import ButtonWithText from "../../components/ButtonWithText";
import type { UserAnswerOption } from "../../models/UserAnswerOptionModel";

export function StartQuizPage() {
    const { quizId } = useParams();
    const { quizzes, quizResult, startQuiz, currentUserAnswerIndex, setCurrentUserAnswerIndex, incrementIndex, decrementIndex } = useQuizContext();

    const [optionsForm, setOptionsForm] = useState<UserAnswerOption[]>([] as UserAnswerOption[]);
    
    const quiz = quizzes.find(q => q.id === parseInt(quizId ?? "0"));
    if(!quiz) return <div>Quiz not found</div>

    const handleStartQuiz = async () => {

        try {
            const quizIdNumber = parseInt(quizId ?? "0");
            const { startedUserQuizResult } = await startQuizFetch(quizIdNumber);

            startQuiz(startedUserQuizResult);
        } catch (err) {
            alert("Error starting quiz!");
        }
    }

    return (
        <>
        <Navigation />
        <div>
            { quizResult !== null ? 
                <StartQuizInfo quiz={quiz} onStartQuiz={handleStartQuiz}/>
            :
            <div className={styles.mainDiv}>

                <div className={styles.timerDiv}>
                    Timer: 09:54
                </div>
                <div className={styles.questionDiv}>
                    <div>Difficulty: {setQuizDifficultyText(quiz.questions[currentUserAnswerIndex].questionDifficultyId)}</div>
                    <div>{(currentUserAnswerIndex + 1) + ". " + quiz.questions[currentUserAnswerIndex].text}</div>
                </div>
                <div className={styles.answersDiv}>




                {
                    quiz.questions[currentUserAnswerIndex].questionTypeId === 1
                     && 
                    <div>1</div>
                }
                {
                    quiz.questions[currentUserAnswerIndex].questionTypeId === 2
                     && 
                    <div>2</div>
                }
                {
                    quiz.questions[currentUserAnswerIndex].questionTypeId === 3
                     && 
                    <div>3</div>
                }
                {
                    quiz.questions[currentUserAnswerIndex].questionTypeId === 4
                     && 
                    <div>4</div>
                }





                </div>
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
                            onClick={() => setCurrentUserAnswerIndex(index)}
                            className={`${styles.questionNumber} ${currentUserAnswerIndex === index && styles.selectedQuestion}`} 
                            >
                                {index+1}
                            </button>
                        ))}
                    </div>
                    {currentUserAnswerIndex !== (quiz.questions.length - 1) ?
                        <div className={styles.nextButtonDiv}><ButtonWithText onClick={incrementIndex} text="Next"/></div>
                        :
                        <div className={styles.nextButtonDiv}><ButtonWithText text="Finish"/></div>
                    }
                </div>

            </div>
            }
        </div>
        </>
    );
}