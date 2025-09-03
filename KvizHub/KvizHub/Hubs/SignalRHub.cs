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
        public async Task StartCompetition(string eventName, int gameRoomId, int quizId)
        {
            //upisati u bazi isStarted na true
            if (await _gameRoomService.SetIsStartedToTrue(gameRoomId)) {
                var userIds = await _gameRoomService.GetUserIdsForGameRoom(gameRoomId);

                foreach (var userId in userIds)
                {
                    UserQuizResultDto userQuizResultDto = await _gameRoomService.StartQuiz(quizId, userId);
                    await Clients.User(userId.ToString()).SendAsync(eventName, gameRoomId, userQuizResultDto);
                }

                await Clients.User(("1").ToString()).SendAsync(eventName, gameRoomId, null);
            }

            //await Clients.Group(gameRoomId.ToString()).SendAsync(eventName, gameRoomId);

            //await Groups.AddToGroupAsync(Context.ConnectionId, gameRoomId.ToString()); //dodajem admina u grupu da i on dobije signal da je startovao taj room
        }

        [Authorize(Roles = "user")]
        public async Task JoinGameRoom(string eventName, int gameRoomId, string userUsermame)
        {
            RoomParticipantDto roomParticipantDto = await _gameRoomService.JoinGameRoom(gameRoomId, userUsermame);
            await Groups.AddToGroupAsync(Context.ConnectionId, gameRoomId.ToString());
            await Clients.All.SendAsync(eventName, roomParticipantDto);
        }

        [Authorize(Roles = "user")]
        public async Task LeaveGameRoom(string eventName, int gameRoomId, string userUsermame)
        {
            int roomParticipantId = await _gameRoomService.LeaveGameRoom(gameRoomId, userUsermame);
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, gameRoomId.ToString());
            await Clients.All.SendAsync(eventName, roomParticipantId);
        }

    }
}
