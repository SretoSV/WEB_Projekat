namespace KvizHub.Models
{
    public class QuizCategory
    {
        #region Fields
        public int Id { get; set; }
        public string Name { get; set; }

        public ICollection<AllQuizCategories> AllQuizCategories { get; set; }
        #endregion

        #region Constructors
        public QuizCategory() { }
        public QuizCategory(int id, string name)
        {
            Id = id;
            Name = name;
        }
        #endregion

    }
}
