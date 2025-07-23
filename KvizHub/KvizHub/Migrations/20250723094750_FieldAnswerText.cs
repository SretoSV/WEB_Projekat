using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KvizHub.Migrations
{
    /// <inheritdoc />
    public partial class FieldAnswerText : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "FieldAnswerText",
                table: "answer_options",
                type: "tinyint(1)",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "Id",
                keyValue: 1,
                column: "PasswordHash",
                value: "AQAAAAIAAYagAAAAEBCG609bCPLarEsK+AxauL52ecDozqVU1V19ULHBm7L8Jl9k8ntAWa1Fe5+bPjG1yQ==");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FieldAnswerText",
                table: "answer_options");

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "Id",
                keyValue: 1,
                column: "PasswordHash",
                value: "AQAAAAIAAYagAAAAEKLECvzhptPF8Ky6rpukJV6YzuSg761Jq5y+q03ounz3H1tpb2q1hRJim8SIuRiABw==");
        }
    }
}
