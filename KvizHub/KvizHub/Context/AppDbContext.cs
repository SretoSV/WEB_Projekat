using KvizHub.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace KvizHub.Context
{
    public class AppDbContext : DbContext
    {
        //dotnet ef migrations add NameOfMigration
        //dotnet ef database update
        private readonly PasswordHasher<User> _passwordHasher = new PasswordHasher<User>();

        public DbSet<User> Users { get; set; }
        public DbSet<Quiz> Quizzes { get; set; }
        public DbSet<QuizCategory> QuizCategories { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<AnswerOption> AnswerOptions { get; set; }
        public DbSet<UserQuizResult> UserQuizResults { get; set; }
        public DbSet<UserAnswer> UserAnswers { get; set; }
        public DbSet<AllQuizCategories> AllQuizCategories { get; set; }
        public DbSet<QuestionType> QuestionTypes { get; set; }
        public DbSet<QuizDifficulty> QuizDifficulties { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().ToTable("users");
            modelBuilder.Entity<Quiz>().ToTable("quizzes");
            modelBuilder.Entity<QuizCategory>().ToTable("quiz_categories");
            modelBuilder.Entity<Question>().ToTable("questions");
            modelBuilder.Entity<AnswerOption>().ToTable("answer_options");
            modelBuilder.Entity<UserQuizResult>().ToTable("user_quiz_results");
            modelBuilder.Entity<UserAnswer>().ToTable("user_answers");
            modelBuilder.Entity<AllQuizCategories>().ToTable("all_quiz_categories");
            modelBuilder.Entity<QuestionType>().ToTable("question_types");
            modelBuilder.Entity<QuizDifficulty>().ToTable("quiz_difficulties");

            //Seed Users
            var seededUser = new User
            {
                Id = 1,
                Username = "Ana123",
                Email = "anaanic@gmail.com",
                IsAdmin = true,
                ProfileImage = null,
            };
            seededUser.PasswordHash = _passwordHasher.HashPassword(seededUser, "123");
            modelBuilder.Entity<User>().HasData(seededUser);

            //Seed QuestionTypes
            modelBuilder.Entity<QuestionType>().HasData(
                new QuestionType
                {
                    Id = 1,
                    Title = "multiple-choice",
                },
                new QuestionType
                {
                    Id = 2,
                    Title = "multiple-correct-answers",
                },
                new QuestionType
                {
                    Id = 3,
                    Title = "true-false",
                },
                new QuestionType
                {
                    Id = 4,
                    Title = "fill-in-the-blank",
                }
            );

            //Seed QuizDifficulties
            modelBuilder.Entity<QuizDifficulty>().HasData(
                new QuizDifficulty
                {
                    Id = 1,
                    Title = "easy",
                },
                new QuizDifficulty
                {
                    Id = 2,
                    Title = "medium",
                },
                new QuizDifficulty
                {
                    Id = 3,
                    Title = "hard",
                }
            );

            base.OnModelCreating(modelBuilder);
        }
    }
}
