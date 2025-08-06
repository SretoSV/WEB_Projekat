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
import { fetchAllUsers } from "../../services/UserService";
import { SelectionArea } from "../../components/UserResultsPageComponents/SelectionArea";

export function UserQuizResults(){
    const { user } = useUserContext();
    const [quizzes, setQuizzes] = useState<Array<Quiz>>([]);
    const [usersUsernames, setUsersUsernames] = useState<Array<string>>([]);
    const [results, setResults] = useState<Array<UserQuizResult>>([]);

    const [selectedQuizId, setSelectedQuizId] = useState<number>(0);
    const [selectedUserUsername, setSelectedUserUsername] = useState<string>("");
    const selectedQuiz = quizzes.find(q => q.id === selectedQuizId);
    const [openResultIds, setOpenResultIds] = useState<Set<number>>(new Set());
    const [toggleChart, setToggleChart] = useState<boolean>(false);

    useEffect(() => {
        fetchQuizzes();
    }, [user]);

    useEffect(() => {
        fetchQuizzes();
    }, [selectedUserUsername]);

    const fetchQuizzes = async () => {
        try {
            const usernameToUse = selectedUserUsername !== "" ? selectedUserUsername : user?.username || "";
            const { quizzes } = await fetchQuizzesByUserUsername(usernameToUse);//dohvatit sve quizove koje je user resavao
            setQuizzes(quizzes);

            if(user && user.isAdmin){
                const { allUserUsernames } = await fetchAllUsers();
                setUsersUsernames(allUserUsernames);
            }
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleChangeQuiz = (value: string) => {
        const id = Number(value);
        setSelectedQuizId(id);
        setToggleChart(false);

        if(value !== ""){
            console.log(value);
            const usernameToUse = selectedUserUsername !== "" ? selectedUserUsername : user?.username || "";
            const fetchData = async () => {
            try {
                const { results } = await fetchQuizResultsByUserUsernameAndQuizId(usernameToUse, id);//dohvatit sve quizResultove quizova koje je user resavao
                setResults(results);
            } catch (err: any) {
                alert(err.message);
            }
            };
            fetchData();
        }
    }

    const toggleResult = (id: number) => {
        setOpenResultIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    return <> 
    <Navigation />
    <div className={styles.mainDiv}>
        <SelectionArea
            selectedUserUsername={selectedUserUsername}
            setSelectedUserUsername={setSelectedUserUsername}
            usersUsernames={usersUsernames}
            selectedQuizId={selectedQuizId}
            onChangeQuiz={handleChangeQuiz}
            quizzes={quizzes}
            selectedQuiz={selectedQuiz || null}
            setToggleChart={setToggleChart}
        />

        {toggleChart && <Chart />}

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
                <div className={styles.toggleButton}><ButtonWithText text="Details" onClick={() => toggleResult(result.id)} /></div>
                {openResultIds.has(result.id) && (
                    <CompareQuestionAndAnswer finishedQuizResult={result} quiz={selectedQuiz} />
                )}
            </div>
            })}
    </div>
    </>
}