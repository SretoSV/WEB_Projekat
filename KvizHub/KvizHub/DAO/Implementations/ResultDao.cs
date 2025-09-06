using KvizHub.Context;
using KvizHub.DTO;
using KvizHub.Models;
using Microsoft.EntityFrameworkCore;

namespace KvizHub.DAO.Implementations
{
    public class ResultDao : IResultDao
    {
        private readonly AppDbContext _context;

        public ResultDao(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<UserQuizResult>> GetAllUserResultsForQuiz(int quizId, int userId)
        {
            return await _context.UserQuizResults
            .Where(uqr => uqr.QuizId == quizId && uqr.UserId == userId)
            .Include(uqr => uqr.Answers)
                .ThenInclude(a => a.UserAnswerOptions)
            .ToListAsync();
        }

        public async Task<List<UserQuizResult>> GetAllResultsForQuiz(int quizId)
        {
            return await _context.UserQuizResults
            .Where(uqr => uqr.QuizId == quizId)
            .Include(uqr => uqr.Answers)
                .ThenInclude(a => a.UserAnswerOptions)
            .ToListAsync();
        }

        public async Task<UserQuizResult?> GetUserQuizResultById(int userQuizResultId)
        {
            return await _context.UserQuizResults
                .Include(uqr => uqr.Answers)
                    .ThenInclude(a => a.UserAnswerOptions)
                .FirstOrDefaultAsync(uqr => uqr.Id == userQuizResultId);
        }

    }
}
