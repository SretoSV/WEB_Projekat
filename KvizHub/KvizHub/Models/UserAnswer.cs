namespace KvizHub.Models
{
    public class UserAnswer
    {
        #region Fields
        public int Id { get; set; }

        public int ResultId { get; set; }
        public UserQuizResult Result { get; set; }

        public int QuestionId { get; set; }
        public Question Question { get; set; }

        public string AnswerText { get; set; }
        #endregion

        #region Constructors
        public UserAnswer() { }
        public UserAnswer(int id, int resultId, UserQuizResult result, int questionId, Question question, string answerText)
        {
            Id = id;
            ResultId = resultId;
            Result = result;
            QuestionId = questionId;
            Question = question;
            AnswerText = answerText;
        }
        #endregion
    }
}
