namespace KvizHub.Models
{
    public class AnswerOption
    {
        #region Fields
        public int Id { get; set; }
        public string Text { get; set; }
        public bool IsCorrect { get; set; }
        public bool? FieldAnswerText { get; set; }

        public int QuestionId { get; set; }
        public Question Question { get; set; }
        #endregion

        #region Constructors
        public AnswerOption() { }
        public AnswerOption(int id, string text, bool isCorrect, int questionId)
        {
            Id = id;
            Text = text;
            IsCorrect = isCorrect;
            QuestionId = questionId;
        }
        #endregion
    }
}
