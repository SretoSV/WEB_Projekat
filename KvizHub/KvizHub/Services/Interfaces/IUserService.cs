using KvizHub.DTO;

namespace KvizHub.Services.Interfaces
{
    public interface IUserService
    {
        Task<UserLoginResponseDto> Login(LoginUserDto dto);
        Task<UserRegisterResponseDto> Register(RegisterUserDto dto);
    }
}
