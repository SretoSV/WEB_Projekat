using KvizHub.DTO;
using KvizHub.Models;

namespace KvizHub.DAO
{
    public interface IAnswerDao
    {
        Task<List<UserAnswer>> CreateUserAnswers(int quizId, int resultId, List<Question> questions, int userId);
        Task AddAnswerOptionsAsync(List<QuestionDto> questions);
    }
}
