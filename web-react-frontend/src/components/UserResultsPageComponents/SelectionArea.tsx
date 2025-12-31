import ButtonWithLongText from "../ButtonWithLongText";
import styles from "../../styles/AllQuizzesPagesStyles/UserQuizResultsStyle.module.css";
import { useUserContext } from "../../context/UserContext";
import type { QuizDto } from "../../models/QuizModel";
interface SelectionAreaProps{
    selectedUserUsername: string;
    onChangeUserUsername: (username: string) => void;
    usersUsernames: Array<string>;
    selectedQuizId: number;
    onChangeQuiz: (value: string) => void;
    quizzes: Array<QuizDto>;
    selectedQuiz: QuizDto | null;
    setToggleChart: React.Dispatch<React.SetStateAction<boolean>>;
}

export function SelectionArea({selectedUserUsername, onChangeUserUsername, usersUsernames, selectedQuizId, onChangeQuiz, quizzes, selectedQuiz, setToggleChart}: SelectionAreaProps){
    const { user } = useUserContext();
    
    return <div className={styles.chooseDiv}>
            {
                (user && user.isAdmin) &&
                <select
                    id="user"
                    name="user"
                    data-testid="select-user"
                    className={styles.dropdownInput}
                    value={selectedUserUsername}
                    onChange={(e) => {
                        onChangeUserUsername(e.target.value);
                    }}
                >
                    <option value="">Select user</option>
                    {usersUsernames.map((userUsername) => (
                        <option key={userUsername} value={userUsername}>{userUsername}</option>
                    ))}
                </select>
            }
            <select
                id="quiz"
                name="quiz"
                data-testid="select-quiz"
                className={styles.dropdownInput}
                value={selectedQuizId}
                onChange={(e) => onChangeQuiz(e.target.value)}
            >
                <option value={0}>Select quiz</option>
                {quizzes.map((quiz) => (
                    <option key={quiz.id} value={quiz.id}>{quiz.title}</option>
                ))}
            </select>


            {selectedQuiz && 
            <div className={styles.toggleButton}>
                <ButtonWithLongText text="Toggle chart" onClick={() => setToggleChart(c => !c)}/>
            </div>}
        </div>
}