import { useParams } from "react-router-dom";
import { useQuizContext } from "../../context/QuizContext";
import styles from "../../styles/AllQuizzesPagesStyles/StartQuizPageStyle.module.css";
import { useState, useEffect } from "react";
import { setQuizDifficultyText, startQuizFetch } from "../../services/QuizService";
import { StartQuizInfo } from "../../components/StartQuizInfo";
import ButtonWithText from "../../components/ButtonWithText";
import { formatTime } from "../../functions/formatTimeFunction";

export function StartQuizPage() {
    const { quizId } = useParams();
    const { quizzes, quizResult, startQuiz, currentUserAnswerIndex, timeLeft, setQuizResult, restoreTimer, initializeTimer, handleSetIndex, finishQuiz, incrementIndex, decrementIndex } = useQuizContext();

    const [fillInAnswer, setFillInAnswer] = useState<string>("");
    const [iDontKnowStates, setIDontKnowStates] = useState<boolean[]>([]);
    const quiz = quizzes.find(q => q.id === parseInt(quizId ?? "0"));

    useEffect(() => {
        //setujem i dont know za svako pitanje
        setIDontKnowStates(prev => {
            const copy = [...prev];
            while (copy.length <= currentUserAnswerIndex) {
                copy.push(false);
            }
            return copy;
        });
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

    const handleStartQuiz = async () => {
        
        try {
            const quizIdNumber = parseInt(quizId ?? "0");
            const { startedUserQuizResult } = await startQuizFetch(quizIdNumber);
            
            initializeTimer(quiz?.timeLimitSeconds || 0);

            startQuiz(startedUserQuizResult);
        } catch (err) {
            alert("Error starting quiz!");
        }
    }

    if(!quiz) return <div>Quiz not found</div>

    return (
        <>
        <div>
            { quizResult === null ? 
                <StartQuizInfo quiz={quiz} onStartQuiz={handleStartQuiz}/>
            :
            <div className={styles.mainDiv}>
                <div className={styles.timerDiv}>
                    {timeLeft !== null ? formatTime(timeLeft) : "00:00"}
                </div>
                {currentUserAnswerIndex === quiz.questions.length ? 
                <div>
                    Are you sure?
                </div>
                : 
                <>
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
                                    setQuizResult(prev => {
                                        if (!prev || !prev.answers) return prev;
                                        const updatedAnswers = [...prev.answers];
                                        updatedAnswers[currentUserAnswerIndex] = {
                                            ...updatedAnswers[currentUserAnswerIndex],
                                            userAnswerOptions: updatedAnswers[currentUserAnswerIndex]?.userAnswerOptions?.map(opt => ({
                                                ...opt,
                                                isCorrect: null,
                                                fieldAnswerText: null
                                            }))
                                        };
                                        return { ...prev, answers: updatedAnswers };
                                    });
                                    setFillInAnswer("");
                                }
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
                                                    checked={quizResult.answers?.[currentUserAnswerIndex]?.userAnswerOptions?.[index]?.isCorrect || false}
                                                    onChange={() => {
                                                    setQuizResult(prev => {
                                                        if (!prev || !prev.answers) return prev;
                                                        const updatedAnswers = [...prev.answers];
                                                        const newOptions = updatedAnswers[currentUserAnswerIndex]?.userAnswerOptions?.map((opt, i) => ({
                                                        ...opt,
                                                        isCorrect: i === index
                                                        }));
                                                        updatedAnswers[currentUserAnswerIndex] = {
                                                            ...updatedAnswers[currentUserAnswerIndex],
                                                            userAnswerOptions: newOptions
                                                        };
                                                        return { ...prev, answers: updatedAnswers };
                                                    });
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
                                                checked={quizResult.answers?.[currentUserAnswerIndex]?.userAnswerOptions?.[index]?.isCorrect || false}
                                                onChange={(e) => {
                                                    const isChecked = e.target.checked;
                                                    setQuizResult(prev => {
                                                        if (!prev || !prev.answers) return prev;
                                                        const updatedAnswers = [...prev.answers];
                                                        const currentAnswer = updatedAnswers[currentUserAnswerIndex];

                                                        if (!currentAnswer || !currentAnswer.userAnswerOptions) return prev;

                                                        const updatedOptions = [...currentAnswer.userAnswerOptions];
                                                        updatedOptions[index] = {
                                                            ...updatedOptions[index],
                                                            isCorrect: isChecked
                                                        };

                                                        updatedAnswers[currentUserAnswerIndex] = {
                                                            ...currentAnswer,
                                                            userAnswerOptions: updatedOptions
                                                        };

                                                        return { ...prev, answers: updatedAnswers };
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
                                            checked={quizResult.answers?.[currentUserAnswerIndex]?.userAnswerOptions?.[0]?.isCorrect === true}
                                            value="True"
                                            name="trueFalseStatement"
                                            onChange={() => {
                                                setQuizResult(prev => {
                                                    if (!prev || !prev.answers) return prev;
                                                    const updatedAnswers = [...prev.answers];
                                                    updatedAnswers[currentUserAnswerIndex] = {
                                                        ...updatedAnswers[currentUserAnswerIndex],
                                                        userAnswerOptions: updatedAnswers[currentUserAnswerIndex]?.userAnswerOptions?.map(opt => ({
                                                            ...opt,
                                                            isCorrect: true
                                                        }))
                                                    };
                                                    return { ...prev, answers: updatedAnswers };
                                                });
                                            }}
                                        />
                                    </div>
                                    <div className={styles.optionRow}>
                                        <label htmlFor={`inputradio-2-true/false`}>False</label>
                                        <input
                                            id={`inputradio-2-true/false`}
                                            type="radio"
                                            checked={quizResult.answers?.[currentUserAnswerIndex]?.userAnswerOptions?.[0]?.isCorrect === false}
                                            value="False"
                                            name="trueFalseStatement"
                                            onChange={() => {
                                            setQuizResult(prev => {
                                                if (!prev || !prev.answers) return prev;
                                                const updatedAnswers = [...prev.answers];
                                                updatedAnswers[currentUserAnswerIndex] = {
                                                    ...updatedAnswers[currentUserAnswerIndex],
                                                    userAnswerOptions: updatedAnswers[currentUserAnswerIndex]?.userAnswerOptions?.map(opt => ({
                                                        ...opt,
                                                        isCorrect: false
                                                    }))
                                                };
                                                return { ...prev, answers: updatedAnswers };
                                            });
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
                                            setQuizResult(prev => {
                                                if (!prev || !prev.answers) return prev;
                                                const updatedAnswers = [...prev.answers];
                                                updatedAnswers[currentUserAnswerIndex] = {
                                                    ...updatedAnswers[currentUserAnswerIndex],
                                                    userAnswerOptions: updatedAnswers[currentUserAnswerIndex]?.userAnswerOptions?.map(opt => ({
                                                        ...opt,
                                                        isCorrect: false,
                                                        fieldAnswerText: newValue
                                                    }))
                                                };
                                                return { ...prev, answers: updatedAnswers };
                                            });
                                        }}
                                    />
                                </div>
                            }
                        </div>
                    }



                </div>
                </>}

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



