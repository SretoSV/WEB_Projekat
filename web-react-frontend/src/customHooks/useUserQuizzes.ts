import { useQuery } from '@tanstack/react-query';
import { fetchQuizzesByUserUsername } from '../services/QuizService';

export function useUserQuizzes(username: string, onLogout: () => void) {
  return useQuery({
    queryKey:['userQuizzes', username],
    queryFn: () => fetchQuizzesByUserUsername(username, onLogout),
    enabled: !!username, 
    staleTime: 1000 * 60 * 5, 
    gcTime: 1000 * 60 * 10,
    });
}
