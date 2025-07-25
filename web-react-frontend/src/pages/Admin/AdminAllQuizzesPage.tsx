import { Navigation } from "../../components/Navigation";
import { QuizzesSection } from "../../components/QuizSection";
import { QuizProvider } from "../../context/QuizContext";
import styles from "../../styles/AllQuizzesPagesStyles/AdminAndUserAllQuizzesPageStyle.module.css";

export function AdminAllQuizzesPage(){
    return <>
        <Navigation />
        <div className={styles.mainDiv}>
            <QuizProvider>
                <QuizzesSection />
            </QuizProvider>
        </div>
    </>
}