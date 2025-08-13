using KvizHub.Context;
using KvizHub.DTO;
using KvizHub.Models;
using Microsoft.EntityFrameworkCore;

namespace KvizHub.DAO.Implementations
{
    public class GameRoomDao : IGameRoomDao
    {
        private readonly AppDbContext _context;

        public GameRoomDao(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<GameRoom>> GetAllGameRoomsAsync()
        {
            return await _context.GameRooms
                .Where(r => !r.IsFinished)
                .Include(r => r.RoomParticipants)
                .ToListAsync();
        }
        public async Task<GameRoom> AddGameRoomAsync(GameRoom gameRoom)
        {
            _context.GameRooms.Add(gameRoom);
            await _context.SaveChangesAsync();
            return gameRoom;
        }

        public async Task<RoomParticipant> AddUserToGameRoom(RoomParticipant roomParticipant) 
        {
            _context.RoomParticipants.Add(roomParticipant);
            await _context.SaveChangesAsync();
            return roomParticipant;
        }

        public async Task<RoomParticipant> IsUserExistsInGameRoom(int gameRoomId, int userId)
        {
            return await _context.RoomParticipants
                 .FirstOrDefaultAsync(rp => rp.GameRoomId == gameRoomId && rp.UserId == userId);
        }

    }
}
