using KvizHub.Models;

namespace KvizHub.DTO
{
    public class QuizDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int TimeLimitSeconds { get; set; }
        public int QuizDifficultyId { get; set; }

        public ICollection<QuizCategoryDto> AllQuizCategories { get; set; }
        public ICollection<QuestionDto> Questions { get; set; }
        public ICollection<UserQuizResultDto>? Results { get; set; }
    }
}
