using KvizHub.Models;

namespace KvizHub.DTO
{
    public class UserQuizResultDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int QuizId { get; set; }
        public int? TotalQuestions { get; set; }
        public int? CorrectAnswers { get; set; }
        public double? ScorePercentage { get; set; }
        public DateTime StartedAt { get; set; }
        public DateTime? SubmittedAt { get; set; }
        public bool IsStarted { get; set; }

        public ICollection<UserAnswerDto> Answers { get; set; }
    }
}
