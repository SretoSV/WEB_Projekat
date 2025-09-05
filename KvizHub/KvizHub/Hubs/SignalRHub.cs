using KvizHub.DTO;
using KvizHub.Models;
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
        private readonly IQuizService _quizService;

        public SignalRHub(IGameRoomService gameRoomService, IUserService userService, IQuizService quizService)
        {
            _gameRoomService = gameRoomService;
            _userService = userService;
            _quizService = quizService;
        }

        [Authorize(Roles = "admin")]
        public async Task StartCompetition(string eventName, int gameRoomId, int quizId)
        {
            //upisati u bazi isStarted na true
            if (await _gameRoomService.SetIsStartedToTrue(gameRoomId)) {
                var userIds = await _gameRoomService.GetUserIdsForGameRoom(gameRoomId);
                var liveRangList = await _gameRoomService.GenerateLiveRangList(gameRoomId, userIds);

                foreach (var userId in userIds)
                {
                    UserQuizResultDto userQuizResultDto = await _gameRoomService.StartQuiz(quizId, userId);
                    await Clients.User(userId.ToString()).SendAsync(eventName, gameRoomId, userQuizResultDto, await _quizService.GetQuizById(quizId), liveRangList);
                }
            }

            await Clients.All.SendAsync(eventName, gameRoomId, null, null, null);
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

        [Authorize(Roles = "user")]
        public async Task SubmitAnswer(string eventName, int gameRoomId, UserQuizResultDto userQuizResultDto, int currentAnswerIndex)
        {
            Console.WriteLine("GameRoomId: " + gameRoomId);
            Console.WriteLine("userQuizResultDto: " + userQuizResultDto);
            Console.WriteLine("currentAnswerIndex: " + currentAnswerIndex);

            var userIds = await _gameRoomService.GetUserIdsForGameRoom(gameRoomId);
            foreach (var userId in userIds)
            {
                await Clients.User(userId.ToString()).SendAsync(eventName, 125);
            }
        }
    }
}
