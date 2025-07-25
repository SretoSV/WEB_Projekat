using KvizHub.Models;

namespace KvizHub.DTO
{
    public class AnswerOptionDto
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public bool IsCorrect { get; set; }
        public string? FieldAnswerText { get; set; }
        public int QuestionId { get; set; }
    }
}
