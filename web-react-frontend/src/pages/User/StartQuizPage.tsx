import { useParams } from "react-router-dom";
import { useQuizContext } from "../../context/QuizContext";
//import { Navigation } from "../../components/Navigation";
import styles from "../../styles/AllQuizzesPagesStyles/StartQuizPageStyle.module.css";
import { useState, useEffect } from "react";
import { setQuizDifficultyText, startQuizFetch } from "../../services/QuizService";
import { StartQuizInfo } from "../../components/StartQuizInfo";
import ButtonWithText from "../../components/ButtonWithText";
import type { UserAnswerOption } from "../../models/UserAnswerOptionModel";
import { formatTime } from "../../functions/formatTimeFunction";

export function StartQuizPage() {
    const { quizId } = useParams();
    const { quizzes, quizResult, startQuiz, currentUserAnswerIndex, timeLeft, restoreTimer, initializeTimer, handleSetIndex, finishQuiz, handleSetWholeNewUserQuizResult, incrementIndex, decrementIndex } = useQuizContext();

    const [optionsForm, setOptionsForm] = useState<UserAnswerOption[]>([] as UserAnswerOption[]);
    const [fillInAnswer, setFillInAnswer] = useState<string>("");
    const [iDontKnowStates, setIDontKnowStates] = useState<boolean[]>([]);
    const quiz = quizzes.find(q => q.id === parseInt(quizId ?? "0"));

    useEffect(() => {
        setOptionsForm(quizResult?.answers?.[currentUserAnswerIndex]?.userAnswerOptions || [] as UserAnswerOption[]);
        setIDontKnowStates(prev => {
            const copy = [...prev];
            while (copy.length <= currentUserAnswerIndex) {
                copy.push(false);
            }
            return copy;
        });
    },[currentUserAnswerIndex, quizResult]);

    useEffect(() => {
        if (quizResult && quiz?.timeLimitSeconds) {
            restoreTimer(quiz.timeLimitSeconds);
        }
    }, [quizResult, quiz?.timeLimitSeconds]);

    const handleStartQuiz = async () => {
        
        try {
            const quizIdNumber = parseInt(quizId ?? "0");
            const { startedUserQuizResult } = await startQuizFetch(quizIdNumber);
            
            initializeTimer(quiz?.timeLimitSeconds || 0);

            startQuiz(startedUserQuizResult);
            setOptionsForm(startedUserQuizResult?.answers?.[currentUserAnswerIndex]?.userAnswerOptions || [] as UserAnswerOption[]);
        } catch (err) {
            alert("Error starting quiz!");
        }
    }

    const handleNext = () => {
        handleSetWholeNewUserQuizResult(optionsForm);
        incrementIndex();
    }
    
    const handleButtonClick = (index: number) => {
        handleSetWholeNewUserQuizResult(optionsForm);
        handleSetIndex(index);
    }

    if(!quiz) return <div>Quiz not found</div>

    return (
        <>
        {/*<Navigation />*/}
        <div>
            { quizResult === null ? 
                <StartQuizInfo quiz={quiz} onStartQuiz={handleStartQuiz}/>
            :
            <div className={styles.mainDiv}>

                <div className={styles.timerDiv}>
                    {timeLeft !== null ? formatTime(timeLeft) : "00:00"}
                </div>
                <div className={styles.questionDiv}>
                    <div>Difficulty: {setQuizDifficultyText(quiz.questions[currentUserAnswerIndex].questionDifficultyId)}</div>
                    <div>{(currentUserAnswerIndex + 1) + ". " + quiz.questions[currentUserAnswerIndex].text}</div>
                </div>
                <div className={styles.answersDiv}>

                    <div className={styles.optionRow}>
                        <label htmlFor="iDontKnow">I don't know</label>
                        <input
                            id="iDontKnow"
                            type="checkbox"
                            checked={iDontKnowStates[currentUserAnswerIndex] || false}
                            name="idontknow"
                            onChange={(e) => {
                                const isChecked = e.target.checked;
                                setIDontKnowStates(prev => {
                                    const updated = [...prev];
                                    updated[currentUserAnswerIndex] = isChecked;
                                    return updated;
                                });

                                if (isChecked) {
                                    setOptionsForm(prevOptions =>
                                        prevOptions.map((opt) => ({
                                            ...opt,
                                            isCorrect: null,
                                            fieldAnswerText: null
                                        }))
                                    );
                                }
                                handleSetWholeNewUserQuizResult(optionsForm);
                                setFillInAnswer("");
                            }}
                        />
                    </div>
                    
                    { !iDontKnowStates[currentUserAnswerIndex] &&
                        <div>
                            {
                                quiz.questions[currentUserAnswerIndex].questionTypeId === 1
                                && 
                                <div>
                                    {
                                        quizResult.answers?.[currentUserAnswerIndex]?.userAnswerOptions?.map((option, index) => (
                                            <div key={option.id} className={styles.optionRow}>
                                                <label htmlFor={`inputradio-${option.id}`}>{option.text}</label>
                                                <input
                                                    id={`inputradio-${option.id}`}
                                                    type="radio"
                                                    name={`radio-group-${currentUserAnswerIndex}`}
                                                    checked={optionsForm?.[index]?.isCorrect || false}
                                                    onChange={() => {
                                                        setOptionsForm(prevOptions =>
                                                            prevOptions.map((opt, i) => ({
                                                                ...opt,
                                                                isCorrect: i === index
                                                            }))
                                                        );
                                                    }}
                                                />
                                            </div>
                                        ))
                                    }
                                </div>
                            }
                            {
                                quiz.questions[currentUserAnswerIndex].questionTypeId === 2
                                && 
                                <div>
                                    {
                                        quizResult.answers?.[currentUserAnswerIndex]?.userAnswerOptions?.map((option, index) => (
                                            <div key={option.id} className={styles.optionRow}>
                                            <label htmlFor={`inputcheck-${option.id}`}>{option.text}</label>
                                            <input
                                                id={`inputcheck-${option.id}`}
                                                type="checkbox"
                                                checked={optionsForm[index]?.isCorrect || false}
                                                onChange={(e) => {
                                                    const isChecked = e.target.checked;

                                                    setOptionsForm(prevOptions => {
                                                        const updatedOptions = [...prevOptions];
                                                        updatedOptions[index] = {
                                                            ...option,
                                                            isCorrect: isChecked
                                                        };

                                                    return updatedOptions;
                                                });
                                                }}
                                            />
                                            </div>
                                        ))
                                    }
                                </div>
                            }
                            {
                                quiz.questions[currentUserAnswerIndex].questionTypeId === 3
                                && 
                                <div>
                                    <div className={styles.optionRow}>
                                        <label htmlFor={`inputradio-1-true/false`}>True</label>
                                        <input
                                            id={`inputradio-1-true/false`}
                                            type="radio"
                                            checked={optionsForm?.[0]?.isCorrect === true}
                                            value="True"
                                            name="trueFalseStatement"
                                            onChange={() => {
                                                setOptionsForm(prevOptions =>
                                                    prevOptions.map((opt) => ({
                                                        ...opt,
                                                        isCorrect: true
                                                    }))
                                                );
                                            }}
                                        />
                                    </div>
                                    <div className={styles.optionRow}>
                                        <label htmlFor={`inputradio-2-true/false`}>False</label>
                                        <input
                                            id={`inputradio-2-true/false`}
                                            type="radio"
                                            checked={optionsForm?.[0]?.isCorrect === false}
                                            value="False"
                                            name="trueFalseStatement"
                                            onChange={() => {
                                                setOptionsForm(prevOptions =>
                                                    prevOptions.map((opt) => ({
                                                        ...opt,
                                                        isCorrect: false
                                                    }))
                                                );
                                            }}
                                        />
                                    </div>
                                </div>
                            }
                            {
                                quiz.questions[currentUserAnswerIndex].questionTypeId === 4
                                && 
                                <div>
                                    <div>fill-in-the-blank</div>
                                    <input
                                        type="text"
                                        placeholder="Enter correct answer"
                                        value={fillInAnswer}
                                        className={styles.singleOption}
                                        onChange={(e) => {
                                            const newValue = e.target.value;
                                            setFillInAnswer(newValue);

                                            setOptionsForm(prevOptions =>
                                                prevOptions.map((opt) => ({
                                                    ...opt,
                                                    isCorrect: false,
                                                    fieldAnswerText: newValue
                                                }))
                                            );
                                        }}
                                    />
                                </div>
                            }
                        </div>
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
                            onClick={() => handleButtonClick(index)}
                            className={`${styles.questionNumber} ${currentUserAnswerIndex === index && styles.selectedQuestion}`} 
                            >
                                {index+1}
                            </button>
                        ))}
                    </div>
                    {currentUserAnswerIndex !== (quiz.questions.length - 1) ?
                        <div className={styles.nextButtonDiv}><ButtonWithText onClick={handleNext} text="Next"/></div>
                        :
                        <div className={styles.nextButtonDiv}><ButtonWithText onClick={finishQuiz} text="Finish"/></div>
                    }
                </div>

            </div>
            }
        </div>
        </>
    );
}



