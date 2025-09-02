import { Navigation } from "../components/Navigation";
import styles from "../styles/GlobalRanglistStyles/GlobalRanglistStyle.module.css";
import { GlobalSelectionArea } from "../components/GlobalRanglistPageComponents/GlobalSelectionArea";
import { useEffect, useState } from "react";
import type { UserQuizResult } from "../models/UserQuizResultModel";
import { filterResultsByPeriod } from "../services/QuizService";
import { RanglistTable } from "../components/GlobalRanglistPageComponents/RanglistTable";
import type { UserDto } from "../models/UserModel";
import { useUserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { useQuizResults } from "../customHooks/useQuizResults";
import { useQuizContext } from "../context/QuizContext";

export function GlobalRanglist(){
    const { user, handleLogout } = useUserContext();
    const { quizResult } = useQuizContext();
    const navigate = useNavigate();
    const [allResults, setAllResults] = useState<Array<UserQuizResult>>([]);
    const [results, setResults] = useState<Array<UserQuizResult>>([]);
    const [userDetails, setUserDetails] = useState<Array<UserDto>>([]);
    const [selectedQuizId, setSelectedQuizId] = useState<number>(0);
    const [selectedTimePeriod, setSelectedTimePeriod] = useState<string>("");

    const { data, isLoading } = useQuizResults(selectedQuizId, handleLogout);

    useEffect(() => {
        if (data) {
            setAllResults(data.results);
            setResults(filterResultsByPeriod(data.results, selectedTimePeriod));
            setUserDetails(data.profiles);
        }
    }, [data]);

    
    useEffect(() => {
        if(!localStorage.getItem('user')){
            navigate("../Login");
        }
    }, [user]);
    
    useEffect(() => {
        if (quizResult) {
            navigate(`/StartQuizPage/${quizResult.quizId}`, { replace: true });
        }
    }, [quizResult]);
    
    const handleChangeQuiz = (value: string) => { 
        if (value === "") return;
        setSelectedQuizId(Number(value));
    };

    const handleChangeTimePeriod = (period: string) => {
        setSelectedTimePeriod(period);
        setResults(filterResultsByPeriod(allResults, period));
    }

    return <>
        <Navigation />
        <div className={styles.mainDiv}>
            <GlobalSelectionArea
                selectedTimePeriod={selectedTimePeriod}
                onChangeTimePeriod={handleChangeTimePeriod}
                selectedQuizId={selectedQuizId}
                onChangeQuiz={handleChangeQuiz}
            />
            {
                isLoading ? 
                    selectedQuizId ?
                        <div>Loading...</div>
                    :
                        <></>
                :
                    <RanglistTable 
                        selectedQuizId={selectedQuizId}
                        results={results}
                        profiles={userDetails}
                    />
            }

        </div>
    </>
}