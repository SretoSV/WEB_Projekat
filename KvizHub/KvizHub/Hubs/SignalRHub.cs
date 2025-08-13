using KvizHub.DTO;
using KvizHub.Services;
using KvizHub.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace KvizHub.Hubs
{
    public class SignalRHub : Hub
    {
        private readonly IGameRoomService _gameRoomService;
        private readonly IUserService _userService;

        public SignalRHub(IGameRoomService gameRoomService, IUserService userService)
        {
            _gameRoomService = gameRoomService;
            _userService = userService;
        }

        [Authorize(Roles = "admin")]
        public async Task StartCompetition(string eventName, int gameRoomId)
        {
            await Clients.All.SendAsync(eventName, $"START {gameRoomId}!");
        }

        [Authorize(Roles = "user")]
        public async Task JoinGameRoom(string eventName, int gameRoomId, string userUsermame)
        {
            RoomParticipantDto roomParticipantDto = await _gameRoomService.JoinGameRoom(gameRoomId, userUsermame);

            await Clients.All.SendAsync(eventName, roomParticipantDto);
        }

    }
}
