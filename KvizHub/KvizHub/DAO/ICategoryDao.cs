using KvizHub.DTO;
using KvizHub.Models;

namespace KvizHub.DAO
{
    public interface ICategoryDao
    {
        Task<List<QuizCategory>> GetAllCategoriesAsync();
    }
}
