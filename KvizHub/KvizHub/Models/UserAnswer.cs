namespace KvizHub.Models
{
    public class UserAnswer
    {
        #region Fields
        public int Id { get; set; }
        public int QuizId { get; set; }
        public Quiz Quiz { get; set; }
        public int ResultId { get; set; }
        public UserQuizResult Result { get; set; }
        public int QuestionId { get; set; }
        public Question Question { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public bool IsTrue { get; set; }

        public ICollection<UserAnswerOption> UserAnswerOptions { get; set; }

        #endregion

        #region Constructors
        public UserAnswer() { }
        public UserAnswer(int id, int quizId, int resultId, int questionId, int userId)
        {
            Id = id;
            QuizId = quizId;
            ResultId = resultId;
            QuestionId = questionId;
            UserId = userId;
        }
        #endregion
    }
}
