using KvizHub.DTO;

namespace KvizHub.Services.Interfaces
{
    public interface IGameRoomService
    {
        Task<List<GameRoomDto>> GetAllGameRooms();
        Task<GameRoomDto> AddGameRoom(GameRoomDto dto);
        Task<RoomParticipantDto> JoinGameRoom(int gameRoomId, string userUsername);
        Task<int> LeaveGameRoom(int gameRoomId, string userUsername);
    }
}
