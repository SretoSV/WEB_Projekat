using KvizHub.DTO;
using KvizHub.Models;

namespace KvizHub.Services.Interfaces
{
    public interface IQuizService
    {
        Task<Quiz> AddQuiz(QuizDto dto);
        Task<Quiz> EditQuiz(int id);
        Task<Quiz> DeleteQuiz(int id);
        Task<List<Quiz>> GetLastXQuizzes(int limit, DateTime? before);

    }
}
