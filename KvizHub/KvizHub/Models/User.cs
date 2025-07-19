namespace KvizHub.Models
{
    public class User
    {
        #region Fields
        public int Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string ProfileImageUrl { get; set; }
        public bool IsAdmin { get; set; }

        public ICollection<UserQuizResult> QuizResults { get; set; }
        #endregion

        #region Constructors
        public User() { }

        public User(int id, string username, string email, string passwordHash, string profileImageUrl, bool isAdmin, ICollection<UserQuizResult> quizResults)
        {
            Id = id;
            Username = username;
            Email = email;
            PasswordHash = passwordHash;
            ProfileImageUrl = profileImageUrl;
            IsAdmin = isAdmin;
            QuizResults = quizResults;
        }
        #endregion
    }
}
