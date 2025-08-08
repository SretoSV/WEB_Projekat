import { Navigation } from "../components/Navigation";
import styles from "../styles/GlobalRanglistStyles/GlobalRanglistStyle.module.css";
import { GlobalSelectionArea } from "../components/GlobalRanglistPageComponents/GlobalSelectionArea";
import { useEffect, useState } from "react";
import type { UserQuizResult } from "../models/UserQuizResultModel";
import { fetchQuizResultsQuizId, filterResultsByPeriod } from "../services/QuizService";
import { RanglistTable } from "../components/GlobalRanglistPageComponents/RanglistTable";
import type { UserDto } from "../models/UserModel";
import { useUserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

export function GlobalRanglist(){
    const { user } = useUserContext();
    const navigate = useNavigate();
    const [allResults, setAllResults] = useState<Array<UserQuizResult>>([]);
    const [results, setResults] = useState<Array<UserQuizResult>>([]);
    const [userDetails, setUserDetails] = useState<Array<UserDto>>([]);
    const [selectedQuizId, setSelectedQuizId] = useState<number>(0);
    const [selectedTimePeriod, setSelectedTimePeriod] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);

    const handleChangeQuiz = (value: string) => {
        const id = Number(value);
        setSelectedQuizId(id);
        if(value !== ""){
            const fetchData = async () => {
                try {
                    setLoading(true);
                    const { results, profiles } = await fetchQuizResultsQuizId(id);//dohvatit sve quizResultove quiz-a
                    setAllResults(results);
                    setResults(filterResultsByPeriod(results, selectedTimePeriod));
                    setUserDetails(profiles);
                } catch (err: any) {
                    alert(err.message);
                }finally{
                    setLoading(false);
                }
            };
            fetchData();
        }
    }

    useEffect(() => {
        if(!localStorage.getItem('user')){
            navigate("../Login");
        }
    }, [user]);

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
                loading ? 
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