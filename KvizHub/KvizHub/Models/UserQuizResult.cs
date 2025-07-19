namespace KvizHub.Models
{
    public class UserQuizResult
    {
        #region Fields
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }

        public int QuizId { get; set; }
        public Quiz Quiz { get; set; }

        public int TotalQuestions { get; set; }
        public int CorrectAnswers { get; set; }
        public double ScorePercentage { get; set; }
        public DateTime SubmittedAt { get; set; }
        public int DurationSeconds { get; set; }

        public ICollection<UserAnswer> Answers { get; set; }
        #endregion

        #region Constructors
        public UserQuizResult() { }
        public UserQuizResult(int id, int userId, int quizId, int totalQuestions, int correctAnswers, double scorePercentage, DateTime submittedAt, int durationSeconds)
        {
            Id = id;
            UserId = userId;
            QuizId = quizId;
            TotalQuestions = totalQuestions;
            CorrectAnswers = correctAnswers;
            ScorePercentage = scorePercentage;
            SubmittedAt = submittedAt;
            DurationSeconds = durationSeconds;
        }
        #endregion
    }
}
