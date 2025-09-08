import { useOnlineQuizContext } from "../../context/OnlineQuizContext";
import { useUserContext } from "../../context/UserContext";
import { onChangFillInTheBlank } from "../../services/QuizService";
import socket from "../../sockets/socket";
import styles from "../../styles/AllQuizzesPagesStyles/StartQuizPageStyle.module.css";
interface FillInTheBlankProps{
    fillInAnswer: string;
    setFillInAnswer: React.Dispatch<React.SetStateAction<string>>;
    gameRoomId: number | undefined;
}
export function OnlineFillInTheBlank({fillInAnswer, setFillInAnswer, gameRoomId}: FillInTheBlankProps){
    const { user } = useUserContext();
    const {setQuizResult, currentUserAnswerIndex} = useOnlineQuizContext();

    return  <div>
                <div>fill-in-the-blank</div>
                <input
                    type="text"
                    placeholder="Enter correct answer"
                    value={fillInAnswer}
                    className={styles.singleOption}
                    onChange={(e) => {
                        const newValue = e.target.value;
                        setFillInAnswer(newValue);
                        onChangFillInTheBlank(setQuizResult, currentUserAnswerIndex, newValue);
                        socket.invoke("AnswerInteraction", "answer_interaction", gameRoomId, user?.username);
                    }}
                />
            </div>
}