namespace KvizHub.Models
{
    public class RefreshToken
    {
        public int Id { get; set; }
        public string TokenHash { get; set; } = null!;
        public DateTime Expires { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? CreatedByIp { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
    }
}
