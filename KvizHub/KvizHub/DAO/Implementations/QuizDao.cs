using KvizHub.Context;
using KvizHub.Models;
using Microsoft.EntityFrameworkCore;

namespace KvizHub.DAO.Implementations
{
    public class QuizDao : IQuizDao
    {
        private readonly AppDbContext _context;

        public QuizDao(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Quiz> AddQuizAsync(Quiz quiz)
        {
            _context.Quizzes.Add(quiz);
            await _context.SaveChangesAsync();
            return quiz;
        }

        public async Task<Quiz> SaveAllQuizCategoriesAsync(Quiz quiz)
        {
            _context.AllQuizCategories.AddRange(quiz.AllQuizCategories);
            await _context.SaveChangesAsync();
            return quiz;
        }

        public async Task<List<Quiz>> GetAllQuizzesAsync() {
            return await _context.Quizzes
                .Include(q => q.Questions)
                .Include(q => q.AllQuizCategories)
                    .ThenInclude(aqc => aqc.QuizCategory)
                .Include(q => q.QuizDifficulty)
                .ToListAsync();
        }

        public async Task<bool> DeleteQuizByIdAsync(int id)
        {
            var quiz = await _context.Quizzes.FindAsync(id);

            if (quiz == null)
                return false;

            _context.Quizzes.Remove(quiz);
            await _context.SaveChangesAsync();
            return true;
        }

    }
}
