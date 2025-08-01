import { useEffect } from "react";
import { Navigation } from "../../components/Navigation";
import { QuizzesSection } from "../../components/QuizSection";
import styles from "../../styles/AllQuizzesPagesStyles/AdminAndUserAllQuizzesPageStyle.module.css";
import { useUserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

export function AdminAllQuizzesPage(){
    const { user } = useUserContext();
    const navigate = useNavigate();
    useEffect(() => {
        if(!user){
            navigate('/Login');
        }
        else{
            if(!user.isAdmin){
                navigate('/UserAllQuizzesPage');
            }
        }
    }, [user]);

    return <>
        <Navigation />
        <div className={styles.mainDiv}>
            <QuizzesSection />
        </div>
    </>
}