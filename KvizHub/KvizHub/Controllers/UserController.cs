using KvizHub.DTO;
using KvizHub.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace KvizHub.Controllers
{
    [Route("api/[controller]")]
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
    }
}
