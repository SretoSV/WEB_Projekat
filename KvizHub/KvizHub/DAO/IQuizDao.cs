using KvizHub.DTO;
using KvizHub.Models;

namespace KvizHub.DAO
{
    public interface IQuizDao
    {
        Task<bool> DoesQuizTitleExistAsync(string title);

        Task<List<Quiz>> GetAllQuizzesAsync();
        Task<List<Quiz>> GetAllUserQuizzesAsync(int id);
        Task<Quiz> GetQuizByIdAsync(int id);

        Task<Quiz> AddQuizAsync(Quiz quiz);
        Task<Quiz> SaveAllQuizCategoriesAsync(Quiz quiz);
        Task<Quiz> SaveAllQuizQuestionsAsync(Quiz quiz);
        Task<bool> SaveUserAnswerToDatabase(UserAnswer updatedAnswer);
        Task<bool> SaveUserQuizResultToDatabase(UserQuizResult updatedResult);

        Task<bool> ClearQuizDependenciesAsync(int quizId);
        Task<bool> EditQuizFields(QuizDto dto, int id);

        Task<bool> DeleteQuizByIdAsync(int id);

        Task<UserQuizResult> StartQuiz(int quizId, int userId, int? gameRoomId);
        Task<bool> FinishQuiz(UserQuizResult updatedResult);

    }
}
