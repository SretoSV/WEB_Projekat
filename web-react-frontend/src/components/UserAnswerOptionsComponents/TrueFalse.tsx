import { useQuizContext } from "../../context/QuizContext";
import type { UserQuizResult } from "../../models/UserQuizResultModel";
import { onChangTrueFalse } from "../../services/QuizService";
import styles from "../../styles/AllQuizzesPagesStyles/StartQuizPageStyle.module.css";
interface TrueFalseProps{
    quizResult: UserQuizResult;
}
export function TrueFalse({quizResult}: TrueFalseProps){
    const {setQuizResult, currentUserAnswerIndex} = useQuizContext();

    return <div>
                <div className={styles.optionRow}>
                    <label htmlFor={`inputradio-1-true/false`}>True</label>
                    <input
                        id={`inputradio-1-true/false`}
                        type="radio"
                        checked={quizResult.answers?.[currentUserAnswerIndex]?.userAnswerOptions?.[0]?.isCorrect === true}
                        value="True"
                        name="trueFalseStatement"
                        onChange={() => {
                            onChangTrueFalse(setQuizResult, currentUserAnswerIndex, true);
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
                            onChangTrueFalse(setQuizResult, currentUserAnswerIndex, false);
                        }}
                    />
                </div>
            </div>
}