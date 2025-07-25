using KvizHub.DTO;
using KvizHub.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace KvizHub.Controllers
{
    [Route("api/User")]
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
            UserLoginResponseDto userLoginResponseDto = await _userService.Login(dto);
            if (userLoginResponseDto == null) {
                return BadRequest(new { message = "Wrong email or password." });
            }
            return Ok(userLoginResponseDto);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromForm] RegisterUserDto dto)
        {
            UserRegisterResponseDto response = await _userService.Register(dto);
            if (response.Success == false)
            {
                return BadRequest(new { message = response.Message });
            }

            return Ok(new { message = response.Message });
        }
    }
}
