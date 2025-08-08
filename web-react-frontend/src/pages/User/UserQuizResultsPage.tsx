import { useEffect, useState } from "react";
import { useUserContext } from "../../context/UserContext"
import styles from "../../styles/AllQuizzesPagesStyles/UserQuizResultsStyle.module.css";
import { fetchQuizResultsByUserUsernameAndQuizId, fetchQuizzesByUserUsername, formatDateTime } from "../../services/QuizService";
import type { QuizDto } from "../../models/QuizModel";
import { Navigation } from "../../components/Navigation";
import type { UserQuizResult } from "../../models/UserQuizResultModel";
import { CompareQuestionAndAnswer } from "../../components/CompareQuestionsAndAnswer";
import ButtonWithText from "../../components/ButtonWithText";
import { Chart } from "../../components/UserResultsPageComponents/Chart";
import { fetchAllUsers } from "../../services/UserService";
import { SelectionArea } from "../../components/UserResultsPageComponents/SelectionArea";
import { useNavigate } from "react-router-dom";

export function UserQuizResults(){
    const { user } = useUserContext();
    const navigate = useNavigate();
    const [quizzes, setQuizzes] = useState<Array<QuizDto>>([]);
    const [usersUsernames, setUsersUsernames] = useState<Array<string>>([]);
    const [results, setResults] = useState<Array<UserQuizResult>>([]);

    const [selectedQuizId, setSelectedQuizId] = useState<number>(0);
    const [selectedUserUsername, setSelectedUserUsername] = useState<string>("");
    const selectedQuiz = quizzes.find(q => q.id === selectedQuizId);
    const [openResultIds, setOpenResultIds] = useState<Set<number>>(new Set());
    const [toggleChart, setToggleChart] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingQuizzes, setLoadingQuizzes] = useState<boolean>(false);
    const [loadingUsers, setLoadingUsers] = useState<boolean>(false);
    
    useEffect(() => {
        if(!localStorage.getItem('user')){
            navigate("../Login");
        }
        else{
            if(user && user.isAdmin){
                fetchUsers();
            }
            if(user && !user.isAdmin){
                fetchQuizzes();
            }
        }
    }, [user]);

    useEffect(() => {
        if(user && user.isAdmin){
            fetchQuizzes();
        }
    }, [selectedUserUsername]);

    const fetchQuizzes = async () => {
        try {
            setLoadingQuizzes(true);
            const usernameToUse = selectedUserUsername !== "" ? selectedUserUsername : user?.username || "";
            const { quizzes } = await fetchQuizzesByUserUsername(usernameToUse);//dohvatit sve quizove koje je user resavao
            setQuizzes(quizzes);
        } catch (err: any) {
            alert(err.message);
        }
        finally{
            setLoadingQuizzes(false);
        }
    };

    const fetchUsers = async () => {
        try{
            setLoadingUsers(true);
            const { allUserUsernames } = await fetchAllUsers();
            setUsersUsernames(allUserUsernames);
        }catch(err: any){
            alert(err);
        }finally{
            setLoadingUsers(false);
        }
    };

    const handleChangeQuiz = (value: string) => {
        const id = Number(value);
        setSelectedQuizId(id);
        setToggleChart(false);

        if(value !== ""){
            const usernameToUse = selectedUserUsername !== "" ? selectedUserUsername : user?.username || "";
            const fetchData = async () => {
                try {
                    setLoading(true);
                    const { results } = await fetchQuizResultsByUserUsernameAndQuizId(usernameToUse, id);//dohvatit sve quizResultove quizova koje je user resavao
                    setResults(results);
                } catch (err: any) {
                    alert(err.message);
                }finally{
                    setLoading(false);
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
    
    const handleChangeUserUsername = (username: string) => {
        setSelectedUserUsername(username);
        setSelectedQuizId(0);
    };

    return <> 
    <Navigation />
    <div className={styles.mainDiv}>
        {loadingQuizzes ?
            <div><br/><br/><br/>Loading quizzes...</div>
            :
            <>
            {user && user.isAdmin ?
                <>
                    {
                        loadingUsers ? 
                        <div>Loading users...</div>
                        :
                        <SelectionArea
                            selectedUserUsername={selectedUserUsername}
                            onChangeUserUsername={handleChangeUserUsername}
                            usersUsernames={usersUsernames}
                            selectedQuizId={selectedQuizId}
                            onChangeQuiz={handleChangeQuiz}
                            quizzes={quizzes}
                            selectedQuiz={selectedQuiz || null}
                            setToggleChart={setToggleChart}
                        />
                    }
                </>
                :
                <SelectionArea
                    selectedUserUsername={selectedUserUsername}
                    onChangeUserUsername={handleChangeUserUsername}
                    usersUsernames={usersUsernames}
                    selectedQuizId={selectedQuizId}
                    onChangeQuiz={handleChangeQuiz}
                    quizzes={quizzes}
                    selectedQuiz={selectedQuiz || null}
                    setToggleChart={setToggleChart}
                />
            }
            </>
        }
        {
            loading ?
                selectedQuizId ?
                    <div>Loading...</div>
                :
                    <></>
            :
            <>
                {toggleChart && <Chart results={results}/>}

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
                            <div>
                                Duration:                                     
                                {duration !== null ?
                                    minutes === 0 ? 
                                    ` ${seconds} sec`
                                    :
                                    ` ${minutes} min ${seconds} sec`
                                :
                                    "Not submitted"
                                }
                            </div>
                        </div>
                        <div className={styles.toggleButton}><ButtonWithText text="Details" onClick={() => toggleResult(result.id)} /></div>
                        {openResultIds.has(result.id) && (
                            <CompareQuestionAndAnswer finishedQuizResult={result} selectedQuizId={selectedQuiz.id} />
                        )}
                    </div>
                    })}
            </>
        }
    
    </div>
    </>
}