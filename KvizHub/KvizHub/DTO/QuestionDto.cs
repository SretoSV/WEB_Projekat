using KvizHub.Models;

namespace KvizHub.DTO
{
    public class QuestionDto
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public int QuestionTypeId { get; set; }
        public int QuizCategoryId { get; set; }
        public int QuizId { get; set; }

        public ICollection<AnswerOptionDto> AnswerOptions { get; set; }
    }
}
