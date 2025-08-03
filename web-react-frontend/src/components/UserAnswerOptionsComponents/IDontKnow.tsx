import { useQuizContext } from "../../context/QuizContext";
import { onChangeIDontKnowCheckbox } from "../../services/QuizService";
import styles from "../../styles/AllQuizzesPagesStyles/StartQuizPageStyle.module.css";
interface IDontKnowProps{
    setIDontKnowStates: React.Dispatch<React.SetStateAction<boolean[]>>;
    iDontKnowStates: boolean[];
    setFillInAnswer: React.Dispatch<React.SetStateAction<string>>;
}
export function IDontKnow({setIDontKnowStates, iDontKnowStates, setFillInAnswer}: IDontKnowProps){
    const {setQuizResult, currentUserAnswerIndex} = useQuizContext();

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