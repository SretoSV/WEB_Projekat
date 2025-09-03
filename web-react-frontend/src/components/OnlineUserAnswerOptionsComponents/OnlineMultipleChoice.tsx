import { useOnlineQuizContext } from "../../context/OnlineQuizContext";
import type { UserQuizResult } from "../../models/UserQuizResultModel";
import { onChangeMultipleChoice } from "../../services/QuizService";
import styles from "../../styles/AllQuizzesPagesStyles/StartQuizPageStyle.module.css";
interface MultipleChoiceProps{
    quizResult: UserQuizResult;
}
export function OnlineMultipleChoice({quizResult}: MultipleChoiceProps){
    const {setQuizResult, currentUserAnswerIndex} = useOnlineQuizContext();

    return <div>
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
                            onChangeMultipleChoice(setQuizResult, currentUserAnswerIndex, index);
                        }}
                        />
                    </div>
                ))
            }
            </div>
}