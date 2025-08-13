using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KvizHub.Migrations
{
    /// <inheritdoc />
    public partial class ChangeColumNameInGameRoom : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IsFinised",
                table: "game_rooms",
                newName: "IsFinished");

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "Id",
                keyValue: 1,
                column: "PasswordHash",
                value: "AQAAAAIAAYagAAAAECt6FLDYFiEyp/IhRdaF/qD8WSa17Z08Laop3QjTxRe6eQz0Ki2hwUv4sap3r2G5xA==");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IsFinished",
                table: "game_rooms",
                newName: "IsFinised");

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "Id",
                keyValue: 1,
                column: "PasswordHash",
                value: "AQAAAAIAAYagAAAAEBC8458wwBEzTnV3j2WtdIPQCFItjXRzVFUTU+BglKLmssn3oAGLwbzMoGo/OyKbxw==");
        }
    }
}
