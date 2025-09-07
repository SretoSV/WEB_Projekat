using KvizHub.DTO;

namespace KvizHub.Services.Interfaces
{
    public interface IUserService
    {
        Task<UserLoginResponseDto> Login(LoginUserDto dto, string? ipAddress);
        Task<UserRegisterResponseDto> Register(RegisterUserDto dto);
        Task<List<string>> GetAllUsersUsernames();
        Task<List<string>> GetUserUsernamesByUserIds(List<int> ids);
        Task LogoutAsync(string refreshTokenHash);
        Task<bool> IsTokenActive(string refreshTokenHash);
        Task<AccessTokenDto> GetNewAccessToken(string refreshTokenHash);
        Task<int> GetUserIdByUsername(string username);


    }
}
