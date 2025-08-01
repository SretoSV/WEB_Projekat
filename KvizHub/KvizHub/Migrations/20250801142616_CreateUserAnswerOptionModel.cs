using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KvizHub.Migrations
{
    /// <inheritdoc />
    public partial class CreateUserAnswerOptionModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AnswerText",
                table: "user_answers");

            migrationBuilder.AddColumn<int>(
                name: "QuizId",
                table: "user_answers",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "user_answers",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "user_answer_options",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Text = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IsCorrect = table.Column<bool>(type: "tinyint(1)", nullable: true),
                    FieldAnswerText = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    UserAnswerId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user_answer_options", x => x.Id);
                    table.ForeignKey(
                        name: "FK_user_answer_options_user_answers_UserAnswerId",
                        column: x => x.UserAnswerId,
                        principalTable: "user_answers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "Id",
                keyValue: 1,
                column: "PasswordHash",
                value: "AQAAAAIAAYagAAAAEHEoGz/eGy5fdlkWrlSfC45++ashKDs72zslrIl0H8FHCjNdW4uwl/g4akpjDKaRPA==");

            migrationBuilder.CreateIndex(
                name: "IX_user_answers_QuizId",
                table: "user_answers",
                column: "QuizId");

            migrationBuilder.CreateIndex(
                name: "IX_user_answers_UserId",
                table: "user_answers",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_user_answer_options_UserAnswerId",
                table: "user_answer_options",
                column: "UserAnswerId");

            migrationBuilder.AddForeignKey(
                name: "FK_user_answers_quizzes_QuizId",
                table: "user_answers",
                column: "QuizId",
                principalTable: "quizzes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_user_answers_users_UserId",
                table: "user_answers",
                column: "UserId",
                principalTable: "users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_user_answers_quizzes_QuizId",
                table: "user_answers");

            migrationBuilder.DropForeignKey(
                name: "FK_user_answers_users_UserId",
                table: "user_answers");

            migrationBuilder.DropTable(
                name: "user_answer_options");

            migrationBuilder.DropIndex(
                name: "IX_user_answers_QuizId",
                table: "user_answers");

            migrationBuilder.DropIndex(
                name: "IX_user_answers_UserId",
                table: "user_answers");

            migrationBuilder.DropColumn(
                name: "QuizId",
                table: "user_answers");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "user_answers");

            migrationBuilder.AddColumn<string>(
                name: "AnswerText",
                table: "user_answers",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "Id",
                keyValue: 1,
                column: "PasswordHash",
                value: "AQAAAAIAAYagAAAAEOArVz/abKj4A14Oa7yoIH0GkSwSfEhu25DEgXDZUd+l4zhYj0vl8HmHR5Hp3s1D/A==");
        }
    }
}
