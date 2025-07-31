namespace KvizHub.Models
{
    public class UserQuizResult
    {
        #region Fields
        public int Id { get; set; } //Not Null
        public int UserId { get; set; } //Not Null
        public User User { get; set; }

        public int QuizId { get; set; } //Not Null
        public Quiz Quiz { get; set; }

        public int? TotalQuestions { get; set; }
        public int? CorrectAnswers { get; set; }
        public double? ScorePercentage { get; set; }
        public DateTime StartedAt { get; set; } //Not Null
        public DateTime? SubmittedAt { get; set; }
        public bool IsStarted { get; set; } //Not Null

        public ICollection<UserAnswer> Answers { get; set; }
        #endregion

        #region Constructors
        public UserQuizResult() { }
        public UserQuizResult(int id, int userId, int quizId, int totalQuestions, int correctAnswers, double scorePercentage, DateTime submittedAt, DateTime startedAt, bool isStarted)
        {
            Id = id;
            UserId = userId;
            QuizId = quizId;
            TotalQuestions = totalQuestions;
            CorrectAnswers = correctAnswers;
            ScorePercentage = scorePercentage;
            StartedAt = startedAt;
            SubmittedAt = submittedAt;
            IsStarted = isStarted;
        }
        #endregion
    }
}
