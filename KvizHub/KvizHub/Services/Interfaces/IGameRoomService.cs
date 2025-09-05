using KvizHub.DTO;
using KvizHub.Models;

namespace KvizHub.Services.Interfaces
{
    public interface IGameRoomService
    {
        Task<List<GameRoomDto>> GetAllGameRooms();
        Task<List<int>> GetUserIdsForGameRoom(int gameRoomId);
        Task<GameRoomDto> AddGameRoom(GameRoomDto dto);
        Task<RoomParticipantDto> JoinGameRoom(int gameRoomId, string userUsername);
        Task<int> LeaveGameRoom(int gameRoomId, string userUsername);
        Task<UserQuizResultDto> StartQuiz(int quizId, int userId);
        Task<bool> SetIsStartedToTrue(int gameRoomId);
        Task<LiveRangListDto> GenerateLiveRangList(int gameRoomId, List<int> userIds);
        Task<LiveRangListDto> GetLiveRangList(int gameRoomId);
    }
}
