using KvizHub.DTO;
using KvizHub.Services;
using KvizHub.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace KvizHub.Controllers
{
    [Route("api/rooms")]
    [ApiController]
    public class GameRoomController : ControllerBase
    {
        private readonly IGameRoomService _gameRoomService;

        public GameRoomController(IGameRoomService gameRoomService)
        {
            _gameRoomService = gameRoomService;
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAllGameRooms()
        {
            try
            {
                List<GameRoomDto> roomsDtos = await _gameRoomService.GetAllGameRooms();
                if (roomsDtos == null)
                {
                    return StatusCode(500, new { message = "Internal server error while fetching rooms." });
                }

                return Ok(roomsDtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An unexpected error occurred.", detail = ex.Message });
            }
        }

        [Authorize(Roles = "admin")]
        [HttpPost]
        public async Task<IActionResult> Add([FromBody] GameRoomDto dto)
        {
            try
            {
                GameRoomDto gameRoomDto = await _gameRoomService.AddGameRoom(dto);

                if (gameRoomDto == null)
                {
                    return StatusCode(500, new { message = "Internal server error while adding game room." });
                }
                return StatusCode(201, gameRoomDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An unexpected error occurred.", detail = ex.Message });
            }
        }

    }
}
