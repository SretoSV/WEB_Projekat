using KvizHub.DTO;
using KvizHub.Models;

namespace KvizHub.Services.Interfaces
{
    public interface IQuizService
    {
        Task<QuizDto> AddQuiz(QuizDto dto);
        Task<QuizDto> EditQuiz(QuizDto dto, int id);
        Task<int> DeleteQuiz(int id);
        Task<List<QuizDto>> GetAllQuizzes();
        Task<UserQuizResultDto> StartQuiz(int quizId);
        Task<UserQuizResultDto> FinishQuiz(UserQuizResultDto userQuizResultDto);
        Task<List<QuizDto>> GetAllUserQuizzes(string username);
        Task<List<UserQuizResultDto>> GetAllUserResultsForQuiz(int quizId, string username);
    }
}
