using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KvizHub.Migrations
{
    /// <inheritdoc />
    public partial class CreateLiveRangList : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "live_rang_lists",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    GameRoomId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_live_rang_lists", x => x.Id);
                    table.ForeignKey(
                        name: "FK_live_rang_lists_game_rooms_GameRoomId",
                        column: x => x.GameRoomId,
                        principalTable: "game_rooms",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "live_rang_list_participants",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    LiveRangListId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Points = table.Column<int>(type: "int", nullable: false, defaultValue: 0)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_live_rang_list_participants", x => x.Id);
                    table.ForeignKey(
                        name: "FK_live_rang_list_participants_live_rang_lists_LiveRangListId",
                        column: x => x.LiveRangListId,
                        principalTable: "live_rang_lists",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_live_rang_list_participants_users_UserId",
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
                value: "AQAAAAIAAYagAAAAEDsmqw1f5dR+WMjULZcMKWJIsWRCrEmrk+4UfHNJdrcosuBmGunr8FOPE1u03OfRmg==");

            migrationBuilder.CreateIndex(
                name: "IX_live_rang_list_participants_LiveRangListId",
                table: "live_rang_list_participants",
                column: "LiveRangListId");

            migrationBuilder.CreateIndex(
                name: "IX_live_rang_list_participants_UserId",
                table: "live_rang_list_participants",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_live_rang_lists_GameRoomId",
                table: "live_rang_lists",
                column: "GameRoomId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "live_rang_list_participants");

            migrationBuilder.DropTable(
                name: "live_rang_lists");

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "Id",
                keyValue: 1,
                column: "PasswordHash",
                value: "AQAAAAIAAYagAAAAEK8TtYKjpSeWqgVHuLF1LGokPjFPJP6XcXZQ17qqJ/VqFHcuq0yHzoRImcAPidP7tA==");
        }
    }
}
