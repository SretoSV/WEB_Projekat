using KvizHub.Models;

namespace KvizHub.DAO
{
    public interface IQuizDao
    {
        Task<Quiz> AddQuizAsync(Quiz quiz);
        Task<Quiz> SaveAllQuizCategoriesAsync(Quiz quiz);
        Task<List<Quiz>> GetAllQuizzesAsync();
        Task<bool> DeleteQuizByIdAsync(int id);


    }
}
