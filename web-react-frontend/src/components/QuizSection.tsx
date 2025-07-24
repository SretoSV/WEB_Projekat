import { useEffect, useState } from 'react';
import { QuizCard } from './QuizCard';
import { useQuizContext } from '../context/QuizContext';
import { addQuiz, fetchQuizzes } from '../services/QuizService';
import styles from "../styles/AllQuizzesPagesStyles/QuizSectionStyle.module.css";
import ButtonWithLongText from './ButtonWithLongText';
import type { Quiz } from '../models/QuizModel';
import AddQuizModal from './AddQuizModal';

export function QuizzesSection() {
  const { quizzes, setQuizzes } = useQuizContext();
  const [isLoading, setIsLoading] = useState(true);
  const [showAddQuizModal, setShowAddQuizModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { quizzes } = await fetchQuizzes();
        setQuizzes(quizzes);
      } catch (err: any) {
        alert(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddQuiz = async (quiz: Quiz) => {
    try {
      const { addedQuiz } = await addQuiz(quiz);
      setQuizzes([...quizzes, addedQuiz]);
    } catch (err) {
      alert("Error adding quiz");
    }
  }

  return (
    isLoading ? <div>Loading...</div> : 
    <div>
        <div className={styles.divTop}>
            <h1 className={styles.title}>Quizzes</h1>
            <div className={styles.addQuizButtonDiv}>
              <ButtonWithLongText text='Add quiz' onClick={() => setShowAddQuizModal(true)}/>
            </div>
            {showAddQuizModal &&
             <AddQuizModal onAddQuiz={handleAddQuiz} onClose={() => setShowAddQuizModal(false)}/>
            }
        </div>

        {quizzes.map(quiz => (
            <QuizCard key={quiz.id} quizId={quiz.id} />
        ))}
    </div>
  );
}