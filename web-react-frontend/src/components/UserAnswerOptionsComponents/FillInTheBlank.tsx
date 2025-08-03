import { useQuizContext } from "../../context/QuizContext";
import { onChangFillInTheBlank } from "../../services/QuizService";
import styles from "../../styles/AllQuizzesPagesStyles/StartQuizPageStyle.module.css";
interface FillInTheBlankProps{
    fillInAnswer: string;
    setFillInAnswer: React.Dispatch<React.SetStateAction<string>>;
}
export function FillInTheBlank({fillInAnswer,setFillInAnswer}: FillInTheBlankProps){
    const {setQuizResult, currentUserAnswerIndex} = useQuizContext();

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
                    }}
                />
            </div>
}