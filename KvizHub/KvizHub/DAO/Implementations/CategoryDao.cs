using KvizHub.Context;
using KvizHub.DTO;
using KvizHub.Models;
using Microsoft.EntityFrameworkCore;

namespace KvizHub.DAO.Implementations
{
    public class CategoryDao : ICategoryDao
    {
        private readonly AppDbContext _context;

        public CategoryDao(AppDbContext context)
        {
            _context = context;
        }
        public async Task<List<QuizCategory>> GetAllCategoriesAsync()
        {
            return await _context.QuizCategories.ToListAsync();
        }
    }
}
