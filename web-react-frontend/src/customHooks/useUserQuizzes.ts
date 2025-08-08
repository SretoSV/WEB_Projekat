import { useQuery } from '@tanstack/react-query';
import { fetchQuizzesByUserUsername } from '../services/QuizService';

export function useUserQuizzes(username: string) {
  return useQuery({
    queryKey:['userQuizzes', username],
    queryFn: () => fetchQuizzesByUserUsername(username),
    enabled: !!username, 
    staleTime: 1000 * 60 * 5, 
    gcTime: 1000 * 60 * 10,
    });
}
