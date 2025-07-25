import { useQuizContext } from '../context/QuizContext';
import { setQuizDifficultyText } from '../services/QuizService';
import styles from '../styles/AllQuizzesPagesStyles/QuizInforamtionCardStyle.module.css';

export function QuizInformationCard({ quizId } : { quizId: number }){
    const { quizzes } = useQuizContext();

    const quiz = quizzes.find(q => q.id === quizId);

    if (!quiz) return <div>Quiz not found</div>;
    
    return<>
            <div className={styles.titleContainer}>
                <div className={styles.quizTitle}>{quiz.title}</div>
            </div>
            <div className={styles.informationsTitle}>Description:</div>
            <div className={styles.inforamtions}>{quiz.description}</div>
            <br />
            <div className={styles.informationsTitle}>Categories:</div>
            <div className={styles.inforamtions}>
                {quiz.allQuizCategories.map(catergory => (
                    <div key={catergory.id} >
                        - {catergory.name}
                    </div>
                ))}
            </div>
            <br />
            <div className={styles.informationsContainer}>
                <div className={styles.informationsTitle}>Number of questions: </div>
                <div className={styles.inforamtions}>{quiz.questions.length}</div>
            </div>
            <br />
            <div className={styles.informationsContainer}>

                <div className={styles.informationsTitle}>Difficulty: </div>
                <div className={styles.inforamtions}>{setQuizDifficultyText(quiz.quizDifficultyId)}</div>
            </div>
            <br />
            <div className={styles.informationsContainer}>
                <div className={styles.informationsTitle}>Time limit: </div>
                <div className={styles.inforamtions}>{quiz.timeLimitSeconds} sec | {quiz.timeLimitSeconds/60} min</div>
            </div>

    </>
}