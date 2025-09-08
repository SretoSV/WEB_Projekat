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
        Task<UserQuizResultDto> StartQuiz(int quizId, int userId, int gameRoomId);
        Task<bool> SetIsStartedToTrue(int gameRoomId);
        Task<bool> SetIsStartedToFalse(int gameRoomId);
        Task<LiveRangListDto> GenerateLiveRangList(int gameRoomId, List<int> userIds);
        Task<LiveRangListDto> GetLiveRangList(int gameRoomId);
        Task<bool> CompareAnswer(int gameRoomId, UserQuizResultDto userQuizResultDto, int currentAnswerIndex);
        Task<UserQuizResultDto> GetUserQuizResultById(UserQuizResultDto userQuizResultDto);
        Task<bool> RemoveGameRoomParticipantsAndLiveRangList(int gameRoomId);
        Task<bool> HaveAllUsersInGameRoomFinishedQuiz(int gameRoomId);

        Task<UserQuizResultDto> GETUserQuizResultById(UserQuizResultDto userQuizResultDto);
        Task<List<UserProfileForRanglistDto>> GetUsersProfilesByRangListId(int liveRangListId);
        Task<bool> DeleteGameRoom(int gameRoomId);
        Task SaveAnswerInteraction(int gameRoomId, string Username);

    }
}
