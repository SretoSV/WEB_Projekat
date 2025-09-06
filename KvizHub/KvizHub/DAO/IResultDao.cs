using KvizHub.Models;

namespace KvizHub.DAO
{
    public interface IResultDao
    {
        Task<List<UserQuizResult>> GetAllUserResultsForQuiz(int quizId, int userId);
        Task<List<UserQuizResult>> GetAllResultsForQuiz(int quizId);
        Task<UserQuizResult?> GetUserQuizResultById(int userQuizResultId);
    }
}
