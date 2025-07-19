namespace KvizHub.Models
{
    public class QuizCategory
    {
        #region Fields
        public int Id { get; set; }
        public string Name { get; set; }

        public ICollection<Quiz> Quizzes { get; set; }
        #endregion

        #region Constructors
        public QuizCategory() { }
        public QuizCategory(int id, string name, ICollection<Quiz> quizzes)
        {
            Id = id;
            Name = name;
            Quizzes = quizzes;
        }
        #endregion

    }
}
