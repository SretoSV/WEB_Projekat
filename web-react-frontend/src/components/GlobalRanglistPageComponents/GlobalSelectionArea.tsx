import styles from "../../styles/GlobalRanglistStyles/GlobalRanglistStyle.module.css";
import { useQuizContext } from "../../context/QuizContext";

interface SelectionAreaProps{
    selectedTimePeriod: string;
    onChangeTimePeriod: (period: string) => void;
    selectedQuizId: number;
    onChangeQuiz: (value: string) => void;
}

export function GlobalSelectionArea({selectedTimePeriod, onChangeTimePeriod, selectedQuizId, onChangeQuiz}: SelectionAreaProps){
    const { quizzes } = useQuizContext();
    
    return <div className={styles.chooseDiv}>

            <select
                id="quiz"
                name="quiz"
                className={styles.dropdownInput}
                value={selectedQuizId}
                onChange={(e) => onChangeQuiz(e.target.value)}
            >
                <option value="">Select quiz</option>
                {quizzes.map((quiz) => (
                    <option key={quiz.id} value={quiz.id}>{quiz.title}</option>
                ))}
            </select>

            <select
                id="timeperiod"
                name="timeperiod"
                className={styles.dropdownInput}
                value={selectedTimePeriod}
                onChange={(e) => onChangeTimePeriod(e.target.value)}
            >
                <option value="">Time period</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
            </select>

        </div>
}