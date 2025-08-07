using KvizHub.DTO;
using KvizHub.Models;

namespace KvizHub.Services.Interfaces
{
    public interface ICategoryService
    {
        Task<List<QuizCategoryDto>> GetAllCategories();
        Task<int> DeleteCategory(int id);

    }
}
