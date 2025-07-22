import { useEffect, useState } from 'react';
import { QuizCard } from './QuizCard';
import { useQuizContext } from '../context/QuizContext';
import { fetchQuizzes } from '../services/QuizService';

export function QuizzesSection() {
  const { quizzes, setQuizzes } = useQuizContext();
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    isLoading ? <div>Loading...</div> : 
    <div>
        {quizzes.map(quiz => (
            <QuizCard key={quiz.id} quizId={quiz.id} />
        ))}
    </div>
  );
}