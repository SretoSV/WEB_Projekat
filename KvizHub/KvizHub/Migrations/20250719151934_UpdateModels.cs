using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KvizHub.Migrations
{
    /// <inheritdoc />
    public partial class UpdateModels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_quizzes_quiz_categories_CategoryId",
                table: "quizzes");

            migrationBuilder.DropIndex(
                name: "IX_quizzes_CategoryId",
                table: "quizzes");

            migrationBuilder.DropColumn(
                name: "ProfileImageUrl",
                table: "users");

            migrationBuilder.DropColumn(
                name: "CategoryId",
                table: "quizzes");

            migrationBuilder.DropColumn(
                name: "QuestionType",
                table: "questions");

            migrationBuilder.AddColumn<byte[]>(
                name: "ProfileImage",
                table: "users",
                type: "longblob",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "QuestionTypeId",
                table: "questions",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "QuizCategoryId",
                table: "questions",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "all_quiz_categories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    QuizCategoryId = table.Column<int>(type: "int", nullable: false),
                    QuizId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_all_quiz_categories", x => x.Id);
                    table.ForeignKey(
                        name: "FK_all_quiz_categories_quiz_categories_QuizCategoryId",
                        column: x => x.QuizCategoryId,
                        principalTable: "quiz_categories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_all_quiz_categories_quizzes_QuizId",
                        column: x => x.QuizId,
                        principalTable: "quizzes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "question_types",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Title = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_question_types", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "users",
                columns: new[] { "Id", "Email", "IsAdmin", "PasswordHash", "ProfileImage", "Username" },
                values: new object[] { 1, "anaanic@gmail.com", true, "AQAAAAIAAYagAAAAEDCy3FvXBCD5JlrJSzE/LLaH4U8dw4nz4rr7trtiPNxJDS+PO2bzAMiJ2Y0MP8g7RQ==", null, "Ana123" });

            migrationBuilder.CreateIndex(
                name: "IX_questions_QuestionTypeId",
                table: "questions",
                column: "QuestionTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_questions_QuizCategoryId",
                table: "questions",
                column: "QuizCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_all_quiz_categories_QuizCategoryId",
                table: "all_quiz_categories",
                column: "QuizCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_all_quiz_categories_QuizId",
                table: "all_quiz_categories",
                column: "QuizId");

            migrationBuilder.AddForeignKey(
                name: "FK_questions_question_types_QuestionTypeId",
                table: "questions",
                column: "QuestionTypeId",
                principalTable: "question_types",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_questions_quiz_categories_QuizCategoryId",
                table: "questions",
                column: "QuizCategoryId",
                principalTable: "quiz_categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_questions_question_types_QuestionTypeId",
                table: "questions");

            migrationBuilder.DropForeignKey(
                name: "FK_questions_quiz_categories_QuizCategoryId",
                table: "questions");

            migrationBuilder.DropTable(
                name: "all_quiz_categories");

            migrationBuilder.DropTable(
                name: "question_types");

            migrationBuilder.DropIndex(
                name: "IX_questions_QuestionTypeId",
                table: "questions");

            migrationBuilder.DropIndex(
                name: "IX_questions_QuizCategoryId",
                table: "questions");

            migrationBuilder.DeleteData(
                table: "users",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DropColumn(
                name: "ProfileImage",
                table: "users");

            migrationBuilder.DropColumn(
                name: "QuestionTypeId",
                table: "questions");

            migrationBuilder.DropColumn(
                name: "QuizCategoryId",
                table: "questions");

            migrationBuilder.AddColumn<string>(
                name: "ProfileImageUrl",
                table: "users",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "CategoryId",
                table: "quizzes",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "QuestionType",
                table: "questions",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_quizzes_CategoryId",
                table: "quizzes",
                column: "CategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_quizzes_quiz_categories_CategoryId",
                table: "quizzes",
                column: "CategoryId",
                principalTable: "quiz_categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
