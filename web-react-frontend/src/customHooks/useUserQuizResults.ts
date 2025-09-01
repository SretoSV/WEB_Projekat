import { useQuery } from '@tanstack/react-query';
import { fetchQuizResultsByUserUsernameAndQuizId } from '../services/QuizService';

export function useUserQuizResults(username: string, quizId: number, onLogout: () => void) {
  return useQuery({
    queryKey:['userQuizResults', username, quizId],
    queryFn: () => fetchQuizResultsByUserUsernameAndQuizId(username, quizId, onLogout),
    enabled: !!username && quizId > 0, 
    staleTime: 1000 * 60 * 5, 
    gcTime: 1000 * 60 * 10,
    });
}
