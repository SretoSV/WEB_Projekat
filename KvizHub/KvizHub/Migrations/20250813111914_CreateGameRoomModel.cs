using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KvizHub.Migrations
{
    /// <inheritdoc />
    public partial class CreateGameRoomModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "game_rooms",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    QuizID = table.Column<int>(type: "int", nullable: false),
                    NumberOfUsers = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_game_rooms", x => x.Id);
                    table.ForeignKey(
                        name: "FK_game_rooms_quizzes_QuizID",
                        column: x => x.QuizID,
                        principalTable: "quizzes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "room_participants",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    GameRoomId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_room_participants", x => x.Id);
                    table.ForeignKey(
                        name: "FK_room_participants_game_rooms_GameRoomId",
                        column: x => x.GameRoomId,
                        principalTable: "game_rooms",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_room_participants_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "Id",
                keyValue: 1,
                column: "PasswordHash",
                value: "AQAAAAIAAYagAAAAECjYhyTm4mN13ElWcMDKGbQZBlKPgsXqeGBFDEhfkHDO0I93rbPW1MzDRZ8LN6TpIA==");

            migrationBuilder.CreateIndex(
                name: "IX_game_rooms_QuizID",
                table: "game_rooms",
                column: "QuizID");

            migrationBuilder.CreateIndex(
                name: "IX_room_participants_GameRoomId",
                table: "room_participants",
                column: "GameRoomId");

            migrationBuilder.CreateIndex(
                name: "IX_room_participants_UserId",
                table: "room_participants",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "room_participants");

            migrationBuilder.DropTable(
                name: "game_rooms");

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "Id",
                keyValue: 1,
                column: "PasswordHash",
                value: "AQAAAAIAAYagAAAAEOpHe7kDTgr39ghVsqUXV+NernTzd6LHdmKD3Mp7jKXgbDbiMky70s87nOi1mM4m7w==");
        }
    }
}
