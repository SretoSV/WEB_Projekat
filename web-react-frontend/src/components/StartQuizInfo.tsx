import type { Quiz } from "../models/QuizModel";
import styles from "../styles/AllQuizzesPagesStyles/StartQuizPageStyle.module.css";
import { motion } from "framer-motion";

interface StartQuizInfoProps{
    quiz: Quiz;
    onStartQuiz: () => void;
}

export function StartQuizInfo({ quiz, onStartQuiz } : StartQuizInfoProps){
    return <>
        <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut"}}
            className={styles.mainDiv}
        >
            <div className={styles.titleContainer}>
                <div className={styles.quizTitle}>{quiz.title}</div>
            </div>
            <div className={styles.informationsContainer}>
                <div className={styles.informationsTitle}>Questions: </div>
                <div className={styles.inforamtions}>{quiz.questions.length}</div>
            </div>
            <div className={styles.informationsContainer}>
                <div className={styles.informationsTitle}>Time limit: </div>
                <div className={styles.inforamtions}>
                    {quiz.timeLimitSeconds} {"sec | "} {String(Math.floor(quiz.timeLimitSeconds / 60)).padStart(2, '0')}:
                    {String(quiz.timeLimitSeconds % 60).padStart(2, '0')} min
                </div>
            </div>
            <button className={styles.startButton} onClick={() => onStartQuiz()}>Start</button>
        </motion.div>
    </>
}