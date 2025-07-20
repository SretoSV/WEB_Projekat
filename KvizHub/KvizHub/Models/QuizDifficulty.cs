namespace KvizHub.Models
{
    public class QuizDifficulty
    {
        #region Fields
        public int Id { get; set; }
        public string Title { get; set; }
        public ICollection<Quiz> Quizzes { get; set; }
        #endregion

        #region Constructors
        public QuizDifficulty() { }
        public QuizDifficulty(int id, string title)
        {
            Id = id;
            Title = title;
        }
        #endregion

    }
}
