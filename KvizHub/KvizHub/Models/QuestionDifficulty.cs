namespace KvizHub.Models
{
    public class QuestionDifficulty
    {
        #region Fields
        public int Id { get; set; }
        public string Title { get; set; }
        public ICollection<Question> Questions { get; set; }
        #endregion

        #region Constructors
        public QuestionDifficulty() { }
        public QuestionDifficulty(int id, string title)
        {
            Id = id;
            Title = title;
        }
        #endregion

    }
}
