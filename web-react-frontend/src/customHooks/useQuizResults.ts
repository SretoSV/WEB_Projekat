import { useQuery } from '@tanstack/react-query';
import { fetchQuizResultsQuizId } from "../services/QuizService";

export function useQuizResults(quizId: number, onLogout: () => void) {
  return useQuery({
    queryKey: ['quizResults', quizId],
    queryFn: () => fetchQuizResultsQuizId(quizId, onLogout),
    enabled: !!quizId,
    staleTime: 1000 * 60 * 5, //5 minuta je svez podatak
    gcTime: 1000 * 60 * 10, //10 minuta cuva u kesu
  });
}