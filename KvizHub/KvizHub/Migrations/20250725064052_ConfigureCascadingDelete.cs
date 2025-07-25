using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KvizHub.Migrations
{
    /// <inheritdoc />
    public partial class ConfigureCascadingDelete : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "Id",
                keyValue: 1,
                column: "PasswordHash",
                value: "AQAAAAIAAYagAAAAEJVuHO+uRUyFP0XpzK3AKqIlKqEtlhS03CBRjqhfvPtH6KiQgb45cCVR5wXShMnqHg==");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "Id",
                keyValue: 1,
                column: "PasswordHash",
                value: "AQAAAAIAAYagAAAAEBCG609bCPLarEsK+AxauL52ecDozqVU1V19ULHBm7L8Jl9k8ntAWa1Fe5+bPjG1yQ==");
        }
    }
}
