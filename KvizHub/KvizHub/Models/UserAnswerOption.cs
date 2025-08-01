namespace KvizHub.Models
{
    public class UserAnswerOption
    {
        #region Fields
        public int Id { get; set; }
        public string Text { get; set; }
        public bool? IsCorrect { get; set; }
        public string? FieldAnswerText { get; set; }

        public int UserAnswerId { get; set; }
        public UserAnswer UserAnswer { get; set; }
        #endregion

        #region Constructors
        public UserAnswerOption() { }
        public UserAnswerOption(int id, string text, bool isCorrect, int userAnswerId)
        {
            Id = id;
            Text = text;
            IsCorrect = isCorrect;
            UserAnswerId = userAnswerId;
        }
        #endregion
    }
}
