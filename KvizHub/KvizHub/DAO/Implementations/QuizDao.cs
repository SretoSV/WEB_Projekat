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
                    .ThenInclude(r => r.User)
                .Include(q => q.Results)
                    .ThenInclude(r => r.Answers)
                .ToListAsync();
        }

        public async Task<List<Quiz>> GetAllUserQuizzesAsync(int id)
        {
            //Dohvati sve QuizId vrednosti za ovo user-a
            var quizIds = await _context.UserQuizResults
                .Where(uqr => uqr.UserId == id)
                .Select(uqr => uqr.QuizId)
                .Distinct()
                .ToListAsync();

            //Ako nije resavao ni jedan kviz vratiti praznu listu
            if (!quizIds.Any())
                return new List<Quiz>();

            //Dohvati sve kvizove
            return await _context.Quizzes
                .Where(q => quizIds.Contains(q.Id))
                .Include(q => q.Questions)
                    .ThenInclude(q => q.AnswerOptions)
                .Include(q => q.AllQuizCategories)
                    .ThenInclude(aqc => aqc.QuizCategory)
                .Include(q => q.QuizDifficulty)
                .Include(q => q.Results)
                    .ThenInclude(r => r.User)
                .Include(q => q.Results)
                    .ThenInclude(r => r.Answers)
                .ToListAsync();
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
                QuestionDifficultyId = dto.QuestionDifficultyId,
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

        public async Task<List<UserAnswer>> CreateUserAnswers(int quizId, int resultId, List<Question> questions, int userId)
        {
            var userAnswers = new List<UserAnswer>();

            foreach (var question in questions)
            {
                var userAnswer = new UserAnswer
                {
                    QuizId = quizId,
                    ResultId = resultId,
                    QuestionId = question.Id,
                    UserId = userId,
                    IsTrue = false,
                    UserAnswerOptions = new List<UserAnswerOption>()
                };

                // Za svaki AnswerOption iz pitanja, napravi UserAnswerOption
                foreach (var option in question.AnswerOptions)
                {
                    var userAnswerOption = new UserAnswerOption
                    {
                        Text = option.Text,
                        IsCorrect = null,
                        FieldAnswerText = null
                        // UserAnswerId će EF postaviti automatski zbog veze
                    };

                    userAnswer.UserAnswerOptions.Add(userAnswerOption);
                }

                userAnswers.Add(userAnswer);
            }

            // Dodaj sve u bazu i sačuvaj
            _context.UserAnswers.AddRange(userAnswers);
            await _context.SaveChangesAsync();

            return userAnswers;
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
