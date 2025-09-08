using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KvizHub.Migrations
{
    /// <inheritdoc />
    public partial class AddIsTrueToAnswerInteraction : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "isTrue",
                table: "answer_interactions",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "Id",
                keyValue: 1,
                column: "PasswordHash",
                value: "AQAAAAIAAYagAAAAEHLBygjpwNKMwZKHtB3pVkXeylBbhm5253xAybiSdvAib1++6trt5vwJeBf6eFptzA==");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "isTrue",
                table: "answer_interactions");

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "Id",
                keyValue: 1,
                column: "PasswordHash",
                value: "AQAAAAIAAYagAAAAEC6uLXB8vyvN7IECcgCuNQ+/ML/OTr7YLZ+w2oT5wN7rwXxCZCSotdAtySPd6hpcnQ==");
        }
    }
}
