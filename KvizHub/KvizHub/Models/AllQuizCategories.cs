namespace KvizHub.Models
{
    public class AllQuizCategories
    {
        #region Fields
        public int Id { get; set; }
        public int QuizCategoryId { get; set; }
        public QuizCategory QuizCategory { get; set; }
        public int QuizId { get; set; }
        public Quiz Quiz { get; set; }
        #endregion

        #region Constructors
        public AllQuizCategories() { }
        public AllQuizCategories(int id, int quizCategoryId, int quizId)
        {
            Id = id;
            QuizCategoryId = quizCategoryId;
            QuizId = quizId;
        }
        #endregion
    }
}
