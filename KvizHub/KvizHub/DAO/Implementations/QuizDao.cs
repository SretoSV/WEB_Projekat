using KvizHub.Context;
using KvizHub.DTO;
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
        
        #region Exists
        public async Task<bool> DoesQuizTitleExistAsync(string title)
        {
            return await _context.Quizzes.AnyAsync(q => q.Title == title);
        }

        #endregion

        #region Get
        public async Task<List<Quiz>> GetAllQuizzesAsync()
        {
            return await _context.Quizzes
                .Include(q => q.Questions)
                    .ThenInclude(q => q.AnswerOptions)
                .Include(q => q.AllQuizCategories)
                    .ThenInclude(aqc => aqc.QuizCategory)
                .Include(q => q.QuizDifficulty)
                .Include(q => q.Results)
                .ToListAsync();
        }

        public async Task<List<Quiz>> GetAllUserQuizzesAsync(int id)
        {
            return await _context.UserQuizResults
                .Where(uqr => uqr.UserId == id)
                .Select(uqr => uqr.Quiz)
                .Distinct()
                .ToListAsync();
        }

        #endregion

        #region Add
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

        public async Task<Quiz> SaveAllQuizQuestionsAsync(Quiz quiz)
        {
            _context.Questions.AddRange(quiz.Questions);
            await _context.SaveChangesAsync();
            return quiz;
        }

        #endregion

        #region Edit
        public async Task<bool> ClearQuizDependenciesAsync(int quizId)
        {
            var quiz = await _context.Quizzes
                .Include(q => q.Questions)
                    .ThenInclude(q => q.AnswerOptions)
                .Include(q => q.AllQuizCategories)
                .Include(q => q.Results)
                .FirstOrDefaultAsync(q => q.Id == quizId);

            if (quiz == null)
                return false;

            // Brisanje AnswerOptions za sve Questions
            var allAnswerOptions = quiz.Questions.SelectMany(q => q.AnswerOptions).ToList();
            _context.AnswerOptions.RemoveRange(allAnswerOptions);

            // Brisanje Questions
            _context.Questions.RemoveRange(quiz.Questions);

            // Brisanje AllQuizCategories
            _context.AllQuizCategories.RemoveRange(quiz.AllQuizCategories);

            // Brisanje UserQuizResults
            _context.UserQuizResults.RemoveRange(quiz.Results);

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> EditQuizFields(QuizDto dto, int id)
        {
            var quiz = await _context.Quizzes.FindAsync(id);

            if (quiz == null)
                return false;

            quiz.Title = dto.Title;
            quiz.Description = dto.Description;
            quiz.TimeLimitSeconds = dto.TimeLimitSeconds;
            quiz.QuizDifficultyId = dto.QuizDifficultyId;

            await _context.SaveChangesAsync();
            return true;
        }
        #endregion

        #region Delete
        public async Task<bool> DeleteQuizByIdAsync(int id)
        {
            var quiz = await _context.Quizzes.FindAsync(id);

            if (quiz == null)
                return false;

            _context.Quizzes.Remove(quiz);
            await _context.SaveChangesAsync();
            return true;
        }
        #endregion

        #region Start/Finish
        public async Task<UserQuizResult> StartQuiz(int quizId, int userId) 
        {

            var newResult = new UserQuizResult
            {
                UserId = userId,
                QuizId = quizId,
                StartedAt = DateTime.UtcNow,
                IsStarted = true
            };

            _context.UserQuizResults.Add(newResult);
            await _context.SaveChangesAsync();

            return newResult;
        }

        public async Task<bool> FinishQuiz(UserQuizResult updatedResult)
        {
            // 1. Pronađi postojeći zapis u bazi po ID-u
            var existingResult = await _context.UserQuizResults
                .Include(r => r.Answers)
                    .ThenInclude(a => a.UserAnswerOptions)
                .FirstOrDefaultAsync(r => r.Id == updatedResult.Id);

            if (existingResult == null)
                return false;

            // 2. Ažuriraj osnovna polja UserQuizResult
            existingResult.TotalQuestions = updatedResult.TotalQuestions;
            existingResult.CorrectAnswers = updatedResult.CorrectAnswers;
            existingResult.ScorePercentage = updatedResult.ScorePercentage;
            existingResult.SubmittedAt = updatedResult.SubmittedAt;
            existingResult.IsStarted = updatedResult.IsStarted;

            // 3. Ažuriraj Answers i njihove opcije
            foreach (var updatedAnswer in updatedResult.Answers)
            {
                var existingAnswer = existingResult.Answers.FirstOrDefault(a => a.Id == updatedAnswer.Id);
                if (existingAnswer != null)
                {
                    existingAnswer.IsTrue = updatedAnswer.IsTrue;

                    foreach (var updatedOption in updatedAnswer.UserAnswerOptions)
                    {
                        var existingOption = existingAnswer.UserAnswerOptions.FirstOrDefault(o => o.Id == updatedOption.Id);
                        if (existingOption != null)
                        {
                            existingOption.IsCorrect = updatedOption.IsCorrect;
                            existingOption.FieldAnswerText = updatedOption.FieldAnswerText;
                        }
                    }
                }
            }

            // 4. Sačuvaj sve izmene
            await _context.SaveChangesAsync();
            return true;
        }

        #endregion
    }
}
