namespace KvizHub.DTO
{
    public class UserLoginResponseDto
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string ProfileImage { get; set; }
        public bool IsAdmin { get; set; }
        public string Token { get; set; }
        public string RefreshToken { get; set; }

        public UserLoginResponseDto() { }

    }
}
