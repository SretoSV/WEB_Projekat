import { useEffect, useState } from "react";
import { useUserContext } from "../../context/UserContext"
import styles from "../../styles/AllQuizzesPagesStyles/UserQuizResultsStyle.module.css";
import { fetchQuizResultsByUserUsernameAndQuizId, fetchQuizzesByUserUsername, formatDateTime } from "../../services/QuizService";
import type { Quiz } from "../../models/QuizModel";
import { Navigation } from "../../components/Navigation";
import type { UserQuizResult } from "../../models/UserQuizResultModel";
import { CompareQuestionAndAnswer } from "../../components/CompareQuestionsAndAnswer";
import ButtonWithText from "../../components/ButtonWithText";
import { Chart } from "../../components/UserResultsPageComponents/Chart";

export function UserQuizResults(){
    const { user } = useUserContext();
    const [quizzes, setQuizzes] = useState<Array<Quiz>>([]);
    const [results, setResults] = useState<Array<UserQuizResult>>([]);
    const [toggle, setToggle] = useState<boolean>(false);

    const [selectedQuizId, setSelectedQuizId] = useState<number>(0);
    const selectedQuiz = quizzes.find(q => q.id === selectedQuizId);

    useEffect(() => {

        const fetchData = async () => {
        try {
            const { quizzes } = await fetchQuizzesByUserUsername(user?.username || "");//dohvatit sve quizove koje je user resavao
            setQuizzes(quizzes);
        } catch (err: any) {
            alert(err.message);
        }
        };
        fetchData();

    }, [user]);

    const handleChangeQuiz = (value: string) => {
        const id = Number(value);
        setSelectedQuizId(id);

        if(value !== ""){
            console.log(value);
            const fetchData = async () => {
            try {
                const { results } = await fetchQuizResultsByUserUsernameAndQuizId(user?.username || "", id);//dohvatit sve quizove koje je user resavao
                setResults(results);
            } catch (err: any) {
                alert(err.message);
            }
            };
            fetchData();
        }
    }

    return <> 
    <Navigation />
    <div className={styles.mainDiv}>
        <select
            id="quiz"
            name="quiz"
            className={styles.dropdownInput}
            value={selectedQuizId}
            onChange={(e) => handleChangeQuiz(e.target.value)}
          >
            <option value="">Select quiz</option>
            {quizzes.map((quiz) => (
              <option key={quiz.id} value={quiz.id}>{quiz.title}</option>
            ))}
        </select>
        <Chart />
        {selectedQuiz && results.map((result, index) => {
            const duration = result.submittedAt 
            ? new Date(result.submittedAt + "Z").getTime() - new Date(result.startedAt + "Z").getTime() 
            : null;

            const minutes = duration ? Math.floor(duration / 60000) : 0;
            const seconds = duration ? Math.floor((duration % 60000) / 1000) : 0;
            return <div key={result.id} className={styles.resultsDiv}>
                <div className={styles.resultIndex}>{index + 1}. Result</div>
                <div className={styles.resultData}>
                    <div>Quiz: {selectedQuiz.title}</div>
                    <div>Date: {formatDateTime(result.startedAt.toString())}</div>
                    <div>Score: {result.scorePercentage}%</div>
                    <div>Duration: {duration !== null ? `${minutes} min ${seconds} sec` : "Not submitted"}</div>
                </div>
                <div className={styles.toggleButton}><ButtonWithText text="Details" onClick={() => setToggle(current => !current)}/></div>
                {toggle && <CompareQuestionAndAnswer finishedQuizResult={result} quiz={selectedQuiz}/>}
            </div>
            })}
    </div>
    </>
}