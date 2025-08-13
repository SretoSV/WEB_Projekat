using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KvizHub.Migrations
{
    /// <inheritdoc />
    public partial class AddIsFinishedToGameRoom : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsFinised",
                table: "game_rooms",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "Id",
                keyValue: 1,
                column: "PasswordHash",
                value: "AQAAAAIAAYagAAAAEBC8458wwBEzTnV3j2WtdIPQCFItjXRzVFUTU+BglKLmssn3oAGLwbzMoGo/OyKbxw==");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsFinised",
                table: "game_rooms");

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "Id",
                keyValue: 1,
                column: "PasswordHash",
                value: "AQAAAAIAAYagAAAAECjYhyTm4mN13ElWcMDKGbQZBlKPgsXqeGBFDEhfkHDO0I93rbPW1MzDRZ8LN6TpIA==");
        }
    }
}
