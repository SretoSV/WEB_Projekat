using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace KvizHub.Migrations
{
    /// <inheritdoc />
    public partial class QuestionDifficulties : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "QuestionDifficultyId",
                table: "questions",
                type: "int",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.CreateTable(
                name: "question_difficulties",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Title = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_question_difficulties", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "question_difficulties",
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
                value: "AQAAAAIAAYagAAAAEFg/UfkHXxH0QKzpJGp3/0dyY9kGLIdSKk5V5Ezrn+9AB3mitfaF+GjBldtnUfrSLA==");

            migrationBuilder.CreateIndex(
                name: "IX_questions_QuestionDifficultyId",
                table: "questions",
                column: "QuestionDifficultyId");

            migrationBuilder.AddForeignKey(
                name: "FK_questions_question_difficulties_QuestionDifficultyId",
                table: "questions",
                column: "QuestionDifficultyId",
                principalTable: "question_difficulties",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_questions_question_difficulties_QuestionDifficultyId",
                table: "questions");

            migrationBuilder.DropTable(
                name: "question_difficulties");

            migrationBuilder.DropIndex(
                name: "IX_questions_QuestionDifficultyId",
                table: "questions");

            migrationBuilder.DropColumn(
                name: "QuestionDifficultyId",
                table: "questions");

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "Id",
                keyValue: 1,
                column: "PasswordHash",
                value: "AQAAAAIAAYagAAAAEPVo0mVyDP+eWzN8gWuLc+FDyXQs8IPLSAZBStqKjl4LZWF0ZLBIMXKHhPdJaWHYAQ==");
        }
    }
}
