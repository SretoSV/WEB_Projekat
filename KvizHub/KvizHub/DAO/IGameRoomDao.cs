using KvizHub.DTO;
using KvizHub.Models;

namespace KvizHub.DAO
{
    public interface IGameRoomDao
    {
        Task<List<GameRoom>> GetAllGameRoomsAsync();
        Task<List<int>> GetUserIdsForGameRoom(int gameRoomId);
        Task<GameRoom> AddGameRoomAsync(GameRoom gameRoom);
        Task<RoomParticipant> AddUserToGameRoom(RoomParticipant roomParticipant);
        Task<RoomParticipant> IsUserExistsInGameRoom(int gameRoomId, int userId);
        Task<bool> RemoveUserFromGameRoom(int id);
        Task<bool> SetIsStartedToTrue(int gameRoomId);
        Task<bool> SetIsStartedToFalse(int gameRoomId);
        Task<LiveRangList> GenerateLiveRangList(int gameRoomId, List<int> userIds);
        Task<LiveRangList> GetLiveRangList(int gameRoomId);
        Task<bool> GivePointToUserIfAnswerIsTrue(int gameRoomId, int userId);
        Task<bool> RemoveGameRoomParticipantsAndLiveRangList(int gameRoomId);
    }
}
