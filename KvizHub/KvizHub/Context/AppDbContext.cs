using KvizHub.Models;
using Microsoft.EntityFrameworkCore;

namespace KvizHub.Context
{
    public class AppDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Quiz> Quizzes { get; set; }
        public DbSet<QuizCategory> QuizCategories { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<AnswerOption> AnswerOptions { get; set; }
        public DbSet<UserQuizResult> UserQuizResults { get; set; }
        public DbSet<UserAnswer> UserAnswers { get; set; }

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

            base.OnModelCreating(modelBuilder);
        }
    }
}
