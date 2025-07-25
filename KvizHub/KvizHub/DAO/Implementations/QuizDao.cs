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

        public async Task<List<Question>> AddQuestionsAsync(ICollection<QuestionDto> questionsDto)
        {
            if (questionsDto == null || questionsDto.Count == 0)
                return new List<Question>();

            var questions = questionsDto.Select(dto => new Question
            {
                Text = dto.Text,
                QuestionTypeId = dto.QuestionTypeId,
                QuizCategoryId = dto.QuizCategoryId,
                QuizId = dto.QuizId
            }).ToList();

            _context.Questions.AddRange(questions);
            await _context.SaveChangesAsync();

            return questions;
        }

        public async Task AddAnswerOptionsAsync(List<QuestionDto> questions)
        {
            if (questions == null || questions.Count == 0)
                return;

            var allAnswerOptions = questions
                .Where(q => q.AnswerOptions != null && q.AnswerOptions.Count > 0)
                .SelectMany(q => q.AnswerOptions)
                .Select(dto => new AnswerOption
                {
                    Text = dto.Text,
                    IsCorrect = dto.IsCorrect,
                    FieldAnswerText = dto.FieldAnswerText,
                    QuestionId = dto.QuestionId
                })
                .ToList();

            if (allAnswerOptions.Count == 0)
                return;

            _context.AnswerOptions.AddRange(allAnswerOptions);
            await _context.SaveChangesAsync();
        }

        public async Task<List<Quiz>> GetAllQuizzesAsync() {
            return await _context.Quizzes
                .Include(q => q.Questions)
                    .ThenInclude(q => q.AnswerOptions)
                .Include(q => q.AllQuizCategories)
                    .ThenInclude(aqc => aqc.QuizCategory)
                .Include(q => q.QuizDifficulty)
                .ToListAsync();
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
    }
}
