import { useNavigate } from "react-router-dom";
import { Navigation } from "../../components/Navigation";
import { QuizzesSection } from "../../components/QuizSection";
import { useUserContext } from "../../context/UserContext";
import styles from "../../styles/AllQuizzesPagesStyles/AdminAndUserAllQuizzesPageStyle.module.css";
import { useEffect } from "react";

export function UserAllQuizzesPage(){
    const { user } = useUserContext();
    const navigate = useNavigate();
    useEffect(() => {
        if(!user){
            navigate('/Login');
        }
    }, [user]);

    return <>
        <Navigation />
        <div className={styles.mainDiv}>
            <QuizzesSection />
        </div>
    </>
}