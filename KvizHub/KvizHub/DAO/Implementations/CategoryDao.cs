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

        public async Task<bool> AddQuizCategoriesAsync(ICollection<QuizCategoryDto> dtoList)
        {
            if (dtoList == null || dtoList.Count == 0)
                return false;

            bool anyAdded = false;

            foreach (var dto in dtoList)
            {
                //Provera da li već postoji kategorija sa istim imenom (case-insensitive) - Football == football
                bool exists = await _context.QuizCategories
                    .AnyAsync(c => c.Name.ToLower() == dto.Name.ToLower());

                if (!exists)
                {
                    var category = new QuizCategory
                    {
                        Name = dto.Name
                    };

                    _context.QuizCategories.Add(category);
                    anyAdded = true;
                }
            }

            if (anyAdded)
            {
                await _context.SaveChangesAsync();
                return true;
            }

            return false;
        }

        public async Task<List<QuizCategory>> GetQuizCategoriesByQuizCategoryNameAsync(ICollection<QuizCategoryDto> dtoList)
        {
            // Izvuci sve imena iz DTO liste
            var names = dtoList.Select(dto => dto.Name.ToLower()).ToList();

            // Vrati Id-ove kategorija čiji Name se poklapa (case-insensitive)
            var categories = await _context.QuizCategories
                .Where(c => names.Contains(c.Name.ToLower()))
                .ToListAsync();

            return categories;
        }

        public async Task AddCategoryIdsToAllQuizCategoriesTableByQuizId(int quizId, List<QuizCategory> categories)
        {
            if (categories == null || categories.Count == 0)
                return;

            var entries = categories.Select(category => new AllQuizCategories
            {
                QuizId = quizId,
                QuizCategoryId = category.Id
            }).ToList();

            _context.AllQuizCategories.AddRange(entries);

            await _context.SaveChangesAsync();
        }

        public async Task<Dictionary<int, bool>> GetCategoryUsageMapAsync()
        {
            return await _context.AllQuizCategories
                .GroupBy(aqc => aqc.QuizCategoryId)
                .Select(group => new
                {
                    CategoryId = group.Key,
                    IsUsed = group.Any()
                })
                .ToDictionaryAsync(x => x.CategoryId, x => x.IsUsed);
        }
        
        public async Task<bool> DeleteCategoryByIdAsync(int id)
        {
            var category = await _context.QuizCategories.FindAsync(id);

            if (category == null)
                return false;

            _context.QuizCategories.Remove(category);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
