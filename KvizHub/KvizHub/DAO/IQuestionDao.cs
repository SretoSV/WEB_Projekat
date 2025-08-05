using KvizHub.Models;

namespace KvizHub.DAO
{
    public interface IQuestionDao
    {
        Task<List<Question>> GetQuestionsByQuizId(int quizId);
        Task<bool> IsQuestionTypeMultipleCorrectAnswers(int questionId);
    }
}
