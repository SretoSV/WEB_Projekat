using KvizHub.DTO;
using KvizHub.Models;

namespace KvizHub.DAO
{
    public interface IQuizDao
    {
        Task<List<Quiz>> GetAllQuizzesAsync();
        Task<List<Quiz>> GetAllUserQuizzesAsync(int id);
        Task<List<UserQuizResult>> GetAllUserResultsForQuiz(int quizId, int userId);

        Task<Quiz> AddQuizAsync(Quiz quiz);
        Task<Quiz> SaveAllQuizCategoriesAsync(Quiz quiz);
        Task<Quiz> SaveAllQuizQuestionsAsync(Quiz quiz);
        Task<bool> AddQuizCategoriesAsync(ICollection<QuizCategoryDto> dtoList);
        Task<List<QuizCategory>> GetQuizCategoriesByQuizCategoryNameAsync(ICollection<QuizCategoryDto> dtoList);
        Task AddCategoryIdsToAllQuizCategoriesTableByQuizId(int quizId, List<QuizCategory> categoryIds);
        Task<List<Question>> AddQuestionsAsync(ICollection<QuestionDto> questionsDto);
        Task AddAnswerOptionsAsync(List<QuestionDto> questions);

        Task<bool> ClearQuizDependenciesAsync(int quizId);
        Task<bool> EditQuizFields(QuizDto dto, int id);

        Task<bool> DeleteQuizByIdAsync(int id);

        Task<UserQuizResult> StartQuiz(int quizId, int userId);
        Task<List<UserAnswer>> CreateUserAnswers(int quizId, int resultId, List<Question> questions, int userId);
        Task<bool> FinishQuiz(UserQuizResult updatedResult);

    }
}
