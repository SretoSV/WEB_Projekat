using KvizHub.DTO;
using KvizHub.Models;

namespace KvizHub.DAO
{
    public interface IQuizDao
    {
        Task<Quiz> AddQuizAsync(Quiz quiz);
        Task<Quiz> SaveAllQuizCategoriesAsync(Quiz quiz);
        Task<Quiz> SaveAllQuizQuestionsAsync(Quiz quiz);
        Task<bool> AddQuizCategoriesAsync(ICollection<QuizCategoryDto> dtoList);
        Task<List<QuizCategory>> GetQuizCategoriesByQuizCategoryNameAsync(ICollection<QuizCategoryDto> dtoList);
        Task AddCategoryIdsToAllQuizCategoriesTableByQuizId(int quizId, List<QuizCategory> categoryIds);
        Task<List<Question>> AddQuestionsAsync(ICollection<QuestionDto> questionsDto);
        Task AddAnswerOptionsAsync(List<QuestionDto> questions);
        Task<List<Quiz>> GetAllQuizzesAsync();

        Task<bool> ClearQuizDependenciesAsync(int quizId);
        Task<bool> EditQuizFields(QuizDto dto, int id);

        Task<bool> DeleteQuizByIdAsync(int id);


    }
}
