namespace KvizHub.Models
{
    public class Question
    {
        #region Fields
        public int Id { get; set; }
        public string Text { get; set; }
        public int QuestionTypeId { get; set; }
        public QuestionType QuestionType { get; set; }
        public int QuizCategoryId { get; set; }
        public QuizCategory QuizCategory { get; set; }
        public int QuestionDifficultyId { get; set; }
        public QuestionDifficulty QuestionDifficulty { get; set; }

        public int QuizId { get; set; }
        public Quiz Quiz { get; set; }

        public ICollection<AnswerOption> AnswerOptions { get; set; }
        #endregion

        #region Constructors
        public Question() { }
        public Question(int id, string text, int questionTypeId, int quizCategoryId, int quizId)
        {
            Id = id;
            Text = text;
            QuestionTypeId = questionTypeId;
            QuizCategoryId = quizCategoryId;
            QuizId = quizId;
        }
        #endregion
    }
}
