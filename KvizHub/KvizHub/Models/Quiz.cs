namespace KvizHub.Models
{
    public class Quiz
    {
        #region Fields
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int TimeLimitSeconds { get; set; }
        public string Difficulty { get; set; }

        public ICollection<AllQuizCategories> AllQuizCategories { get; set; }
        public ICollection<Question> Questions { get; set; }
        public ICollection<UserQuizResult> Results { get; set; }
        #endregion

        #region Constructors
        public Quiz() { }
        public Quiz(int id, string title, string description, int timeLimitSeconds, string difficulty)
        {
            Id = id;
            Title = title;
            Description = description;
            TimeLimitSeconds = timeLimitSeconds;
            Difficulty = difficulty;
        }
        #endregion
    }
}
