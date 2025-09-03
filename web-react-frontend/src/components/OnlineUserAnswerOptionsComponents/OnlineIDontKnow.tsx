import { useOnlineQuizContext } from "../../context/OnlineQuizContext";
import { onChangeIDontKnowCheckbox } from "../../services/QuizService";
import styles from "../../styles/AllQuizzesPagesStyles/StartQuizPageStyle.module.css";
interface IDontKnowProps{
    setIDontKnowStates: React.Dispatch<React.SetStateAction<boolean[]>>;
    iDontKnowStates: boolean[];
    setFillInAnswer: React.Dispatch<React.SetStateAction<string>>;
}
export function OnlineIDontKnow({setIDontKnowStates, iDontKnowStates, setFillInAnswer}: IDontKnowProps){
    const {setQuizResult, currentUserAnswerIndex} = useOnlineQuizContext();

    return <div className={styles.optionRow}>
                <label htmlFor="iDontKnow">I don't know</label>
                <input
                    id="iDontKnow"
                    type="checkbox"
                    checked={iDontKnowStates[currentUserAnswerIndex] || false}
                    name="idontknow"
                    onChange={(e) => {
                        const isChecked = e.target.checked;

                        onChangeIDontKnowCheckbox(
                            isChecked, 
                            currentUserAnswerIndex,
                            setIDontKnowStates,
                            setFillInAnswer,
                            setQuizResult
                        );
                    }}
                />
            </div>
}