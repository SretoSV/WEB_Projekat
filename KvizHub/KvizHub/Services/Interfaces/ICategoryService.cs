using KvizHub.DTO;
using KvizHub.Models;

namespace KvizHub.Services.Interfaces
{
    public interface ICategoryService
    {
        Task<List<QuizCategoryDto>> GetAllCategories();

    }
}
