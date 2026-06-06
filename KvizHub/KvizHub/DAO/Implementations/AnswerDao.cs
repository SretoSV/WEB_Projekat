using KvizHub.Context;
using KvizHub.DTO;
using KvizHub.Models;
using Microsoft.EntityFrameworkCore;

namespace KvizHub.DAO.Implementations
{
    public class AnswerDao : IAnswerDao
    {
        private readonly AppDbContext _context;

        public AnswerDao(AppDbContext context)
        {
            _context = context;
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
                foreach (var option in question.AnswerOptions.OrderBy(x => x.Id))
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
    }
}
