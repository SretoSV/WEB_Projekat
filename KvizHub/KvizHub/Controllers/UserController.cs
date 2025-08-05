using KvizHub.DTO;
using KvizHub.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace KvizHub.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginUserDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.UsernameOrEmail) || string.IsNullOrWhiteSpace(dto.Password))
            {
                return BadRequest(new { message = "Email(Username) and password are required." });
            }

            if (dto.Password.Length > 15 || dto.Password.Length < 3) 
            {
                return BadRequest(new { Message = "Password length must be between 3 and 15 characters!" });
            }

            UserLoginResponseDto userLoginResponseDto = await _userService.Login(dto);
            if (userLoginResponseDto == null) {
                return BadRequest(new { message = "Wrong email or password." });
            }

            return Ok(userLoginResponseDto);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromForm] RegisterUserDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Username) || string.IsNullOrWhiteSpace(dto.Password) || dto.ProfileImage == null)
            {
                return BadRequest(new { message = "Email, Username, Password and Profile image are required." });
            }

            if (dto.Password.Length > 15 || dto.Password.Length < 3)
            {
                return BadRequest(new { Message = "Password length must be between 3 and 15 characters!" });
            }

            UserRegisterResponseDto response = await _userService.Register(dto);
            if (response.Success == false)
            {
                return BadRequest(new { message = response.Message });
            }

            return Ok(new { message = response.Message });
        }
    }
}
