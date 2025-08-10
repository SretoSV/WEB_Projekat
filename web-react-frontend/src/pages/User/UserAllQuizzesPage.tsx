import { useNavigate } from "react-router-dom";
import { Navigation } from "../../components/Navigation";
import { QuizzesSection } from "../../components/QuizSection";
import { useUserContext } from "../../context/UserContext";
import styles from "../../styles/AllQuizzesPagesStyles/AdminAndUserAllQuizzesPageStyle.module.css";
import { useEffect } from "react";
import { useQuizContext } from "../../context/QuizContext";

export function UserAllQuizzesPage(){
    const { user } = useUserContext();
    const { quizResult } = useQuizContext();
    
    const navigate = useNavigate();
    useEffect(() => {
        if(!localStorage.getItem('user')){
            navigate('/Login');
        }
    }, [user]);

    useEffect(() => {
        if (quizResult) {
            navigate(`/StartQuizPage/${quizResult.quizId}`, { replace: true });
        }
    }, [quizResult]);

    return <>
        <Navigation />
        <div className={styles.mainDiv}>
            <QuizzesSection />
        </div>
    </>
}