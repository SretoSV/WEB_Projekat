using KvizHub.Context;
using KvizHub.DTO;
using KvizHub.Models;
using Microsoft.EntityFrameworkCore;

namespace KvizHub.DAO.Implementations
{
    public class QuestionDao : IQuestionDao
    {
        private readonly AppDbContext _context;

        public QuestionDao(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Question>> GetQuestionsByQuizId(int quizId)
        {
            return await _context.Questions
                .Where(q => q.QuizId == quizId)
                .Include(q => q.AnswerOptions)
                .ToListAsync();
        }

        public async Task<bool> IsQuestionTypeMultipleCorrectAnswers(int questionId)
        {
            var question = await _context.Questions
                .FirstOrDefaultAsync(q => q.Id == questionId);

            if (question == null)
                throw new Exception($"Question with ID {questionId} does not exists.");

            return question.QuestionTypeId == 2;
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
    }
}
