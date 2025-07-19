namespace KvizHub.Models
{
    public class QuestionType
    {
        #region Fields
        public int Id { get; set; }
        public string Title { get; set; } // 1,2,3,4
        public ICollection<Question> Questions { get; set; }
        #endregion

        #region Constructors
        public QuestionType() { }
        public QuestionType(int id, string title)
        {
            Id = id;
            Title = title;
        }
        #endregion
    }
}
