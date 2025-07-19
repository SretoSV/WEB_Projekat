namespace KvizHub.Models
{
    public class Question
    {
        #region Fields
        public int Id { get; set; }
        public string Text { get; set; }
        public string QuestionType { get; set; }

        public int QuizId { get; set; }
        public Quiz Quiz { get; set; }

        public ICollection<AnswerOption> AnswerOptions { get; set; }
        #endregion

        #region Constructors
        public Question() { }
        public Question(int id, string text, string questionType, int quizId, Quiz quiz, ICollection<AnswerOption> answerOptions)
        {
            Id = id;
            Text = text;
            QuestionType = questionType;
            QuizId = quizId;
            Quiz = quiz;
            AnswerOptions = answerOptions;
        }
        #endregion
    }
}
