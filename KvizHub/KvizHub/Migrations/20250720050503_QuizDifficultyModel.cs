using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace KvizHub.Migrations
{
    /// <inheritdoc />
    public partial class QuizDifficultyModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Difficulty",
                table: "quizzes");

            migrationBuilder.AddColumn<int>(
                name: "QuizDifficultyId",
                table: "quizzes",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "quiz_difficulties",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Title = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_quiz_difficulties", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "question_types",
                columns: new[] { "Id", "Title" },
                values: new object[,]
                {
                    { 1, "multiple-choice" },
                    { 2, "multiple-correct-answers" },
                    { 3, "true-false" },
                    { 4, "fill-in-the-blank" }
                });

            migrationBuilder.InsertData(
                table: "quiz_difficulties",
                columns: new[] { "Id", "Title" },
                values: new object[,]
                {
                    { 1, "easy" },
                    { 2, "medium" },
                    { 3, "hard" }
                });

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "Id",
                keyValue: 1,
                column: "PasswordHash",
                value: "AQAAAAIAAYagAAAAEBE5evphNAlYYPgqTGv8ztEEQvH09h3X+ziJYVQy24Lqf9HkMDBJLYwIAwyGXHOq6g==");

            migrationBuilder.CreateIndex(
                name: "IX_quizzes_QuizDifficultyId",
                table: "quizzes",
                column: "QuizDifficultyId");

            migrationBuilder.AddForeignKey(
                name: "FK_quizzes_quiz_difficulties_QuizDifficultyId",
                table: "quizzes",
                column: "QuizDifficultyId",
                principalTable: "quiz_difficulties",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_quizzes_quiz_difficulties_QuizDifficultyId",
                table: "quizzes");

            migrationBuilder.DropTable(
                name: "quiz_difficulties");

            migrationBuilder.DropIndex(
                name: "IX_quizzes_QuizDifficultyId",
                table: "quizzes");

            migrationBuilder.DeleteData(
                table: "question_types",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "question_types",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "question_types",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "question_types",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DropColumn(
                name: "QuizDifficultyId",
                table: "quizzes");

            migrationBuilder.AddColumn<string>(
                name: "Difficulty",
                table: "quizzes",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "Id",
                keyValue: 1,
                column: "PasswordHash",
                value: "AQAAAAIAAYagAAAAEDCy3FvXBCD5JlrJSzE/LLaH4U8dw4nz4rr7trtiPNxJDS+PO2bzAMiJ2Y0MP8g7RQ==");
        }
    }
}
