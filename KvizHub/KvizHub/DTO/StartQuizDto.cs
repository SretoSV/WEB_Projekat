namespace KvizHub.DTO
{
    public class StartQuizDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int QuizId { get; set; }
        public DateTime StartedAt { get; set; }
        public bool IsStarted { get; set; }
    }
}
