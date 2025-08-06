import ButtonWithLongText from "../ButtonWithLongText";
import styles from "../../styles/AllQuizzesPagesStyles/UserQuizResultsStyle.module.css";
import { useUserContext } from "../../context/UserContext";
import type { Quiz } from "../../models/QuizModel";
interface SelectionAreaProps{
    selectedUserUsername: string;
    setSelectedUserUsername: React.Dispatch<React.SetStateAction<string>>;
    usersUsernames: Array<string>;
    selectedQuizId: number;
    onChangeQuiz: (value: string) => void;
    quizzes: Array<Quiz>;
    selectedQuiz: Quiz | null;
    setToggleChart: React.Dispatch<React.SetStateAction<boolean>>;
}

export function SelectionArea({selectedUserUsername, setSelectedUserUsername, usersUsernames, selectedQuizId, onChangeQuiz, quizzes, selectedQuiz, setToggleChart}: SelectionAreaProps){
    const { user } = useUserContext();
    
    return <div className={styles.chooseDiv}>
            {
                (user && user.isAdmin) &&
                <select
                    id="user"
                    name="user"
                    className={styles.dropdownInput}
                    value={selectedUserUsername}
                    onChange={(e) => setSelectedUserUsername(e.target.value)}
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
                className={styles.dropdownInput}
                value={selectedQuizId}
                onChange={(e) => onChangeQuiz(e.target.value)}
            >
                <option value="">Select quiz</option>
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