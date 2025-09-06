using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KvizHub.Migrations
{
    /// <inheritdoc />
    public partial class AddGameRoomIdToUserQuizResult : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "GameRoomId",
                table: "user_quiz_results",
                type: "int",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "Id",
                keyValue: 1,
                column: "PasswordHash",
                value: "AQAAAAIAAYagAAAAEJ3dtqIJDIpt8plOFHFIH5ATQqIuHYY7wHB0nXBuDYcMaAjtizZlcN6j6lrecms/JQ==");

            migrationBuilder.CreateIndex(
                name: "IX_user_quiz_results_GameRoomId",
                table: "user_quiz_results",
                column: "GameRoomId");

            migrationBuilder.AddForeignKey(
                name: "FK_user_quiz_results_game_rooms_GameRoomId",
                table: "user_quiz_results",
                column: "GameRoomId",
                principalTable: "game_rooms",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_user_quiz_results_game_rooms_GameRoomId",
                table: "user_quiz_results");

            migrationBuilder.DropIndex(
                name: "IX_user_quiz_results_GameRoomId",
                table: "user_quiz_results");

            migrationBuilder.DropColumn(
                name: "GameRoomId",
                table: "user_quiz_results");

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "Id",
                keyValue: 1,
                column: "PasswordHash",
                value: "AQAAAAIAAYagAAAAEDsmqw1f5dR+WMjULZcMKWJIsWRCrEmrk+4UfHNJdrcosuBmGunr8FOPE1u03OfRmg==");
        }
    }
}
