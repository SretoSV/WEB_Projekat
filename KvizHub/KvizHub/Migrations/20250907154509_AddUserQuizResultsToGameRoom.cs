using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KvizHub.Migrations
{
    /// <inheritdoc />
    public partial class AddUserQuizResultsToGameRoom : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_user_quiz_results_game_rooms_GameRoomId",
                table: "user_quiz_results");

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "Id",
                keyValue: 1,
                column: "PasswordHash",
                value: "AQAAAAIAAYagAAAAEFqBSuEhWAJIFFgcxVpSx0PK1g9KjklI1ODgNiDinozgnX+Wddn7SQKG9Kvwv43uvQ==");

            migrationBuilder.AddForeignKey(
                name: "FK_user_quiz_results_game_rooms_GameRoomId",
                table: "user_quiz_results",
                column: "GameRoomId",
                principalTable: "game_rooms",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_user_quiz_results_game_rooms_GameRoomId",
                table: "user_quiz_results");

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "Id",
                keyValue: 1,
                column: "PasswordHash",
                value: "AQAAAAIAAYagAAAAEJ3dtqIJDIpt8plOFHFIH5ATQqIuHYY7wHB0nXBuDYcMaAjtizZlcN6j6lrecms/JQ==");

            migrationBuilder.AddForeignKey(
                name: "FK_user_quiz_results_game_rooms_GameRoomId",
                table: "user_quiz_results",
                column: "GameRoomId",
                principalTable: "game_rooms",
                principalColumn: "Id");
        }
    }
}
