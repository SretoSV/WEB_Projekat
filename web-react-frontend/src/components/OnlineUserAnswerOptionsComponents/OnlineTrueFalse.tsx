import { useOnlineQuizContext } from "../../context/OnlineQuizContext";
import { useUserContext } from "../../context/UserContext";
import type { UserQuizResult } from "../../models/UserQuizResultModel";
import { onChangTrueFalse } from "../../services/QuizService";
import socket from "../../sockets/socket";
import styles from "../../styles/AllQuizzesPagesStyles/StartQuizPageStyle.module.css";
interface TrueFalseProps{
    quizResult: UserQuizResult;
}
export function OnlineTrueFalse({quizResult}: TrueFalseProps){
    const { user } = useUserContext();
    const {setQuizResult, currentUserAnswerIndex} = useOnlineQuizContext();

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
                            socket.invoke("AnswerInteraction", "answer_interaction", quizResult.gameRoomId, user?.username);
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
                            socket.invoke("AnswerInteraction", "answer_interaction", quizResult.gameRoomId, user?.username);
                        }}
                    />
                </div>
            </div>
}