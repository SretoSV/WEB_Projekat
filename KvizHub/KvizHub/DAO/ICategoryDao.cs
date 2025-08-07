using KvizHub.DTO;
using KvizHub.Models;

namespace KvizHub.DAO
{
    public interface ICategoryDao
    {
        Task<List<QuizCategory>> GetAllCategoriesAsync();
        Task<bool> AddQuizCategoriesAsync(ICollection<QuizCategoryDto> dtoList);
        Task<List<QuizCategory>> GetQuizCategoriesByQuizCategoryNameAsync(ICollection<QuizCategoryDto> dtoList);
        Task AddCategoryIdsToAllQuizCategoriesTableByQuizId(int quizId, List<QuizCategory> categoryIds);
        Task<Dictionary<int, bool>> GetCategoryUsageMapAsync();
        Task<bool> DeleteCategoryByIdAsync(int id);
    }
}
