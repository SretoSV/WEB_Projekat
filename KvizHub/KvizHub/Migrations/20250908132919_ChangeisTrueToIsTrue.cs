using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KvizHub.Migrations
{
    /// <inheritdoc />
    public partial class ChangeisTrueToIsTrue : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "isTrue",
                table: "answer_interactions",
                newName: "IsTrue");

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "Id",
                keyValue: 1,
                column: "PasswordHash",
                value: "AQAAAAIAAYagAAAAELKY4sA/I9oT+Qh1va961f+AjtRrRqYg//TKJap+wSrhIJGhCq0zGDV3DNx1L/+xXg==");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IsTrue",
                table: "answer_interactions",
                newName: "isTrue");

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "Id",
                keyValue: 1,
                column: "PasswordHash",
                value: "AQAAAAIAAYagAAAAEHLBygjpwNKMwZKHtB3pVkXeylBbhm5253xAybiSdvAib1++6trt5vwJeBf6eFptzA==");
        }
    }
}
