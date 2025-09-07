import { useQuery } from '@tanstack/react-query';
import { fetchProfilesForLiveRangList } from '../services/OnlineQuizService';

export function useLiveRangList(id: number, onLogout: () => void) {
  return useQuery({
    queryKey: ['quizResults', id],
    queryFn: () => fetchProfilesForLiveRangList(id, onLogout),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, //5 minuta je svez podatak
    gcTime: 1000 * 60 * 10, //10 minuta cuva u kesu
  });
}