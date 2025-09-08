import { useOnlineQuizContext } from "../../context/OnlineQuizContext";
import { useUserContext } from "../../context/UserContext";
import type { UserQuizResult } from "../../models/UserQuizResultModel";
import { onChangMultipleCorrectAnswers } from "../../services/QuizService";
import socket from "../../sockets/socket";
import styles from "../../styles/AllQuizzesPagesStyles/StartQuizPageStyle.module.css";
interface MultipleCorrectAnswersProps{
    quizResult: UserQuizResult;
}
export function OnlineMultipleCorrectAnswers({quizResult}: MultipleCorrectAnswersProps){
    const { user } = useUserContext();
    const {setQuizResult, currentUserAnswerIndex} = useOnlineQuizContext();

    return <div>
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
                                
                                onChangMultipleCorrectAnswers(setQuizResult, currentUserAnswerIndex, index, isChecked);
                                socket.invoke("AnswerInteraction", "leave_message", quizResult.gameRoomId, user?.username);
                            }}
                        />
                        </div>
                    ))
                }
            </div>
}