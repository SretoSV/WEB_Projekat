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
        Task<LiveRangList> GenerateLiveRangList(int gameRoomId, List<int> userIds);
    }
}
