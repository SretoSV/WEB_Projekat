using System.Diagnostics;
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
        public async Task<List<int>> GetUserIdsForGameRoom(int gameRoomId)
        {
            return await _context.RoomParticipants
                .Where(room => room.GameRoomId == gameRoomId)
                .Select(room => room.UserId)
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
        public async Task<bool> RemoveUserFromGameRoom(int id)
        {
            var participant = await _context.RoomParticipants.FindAsync(id);

            if (participant == null)
                return false;

            _context.RoomParticipants.Remove(participant);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> SetIsStartedToTrue(int gameRoomId)
        {
            var gameRoom = await _context.GameRooms.FindAsync(gameRoomId);

            if (gameRoom == null)
                return false;

            gameRoom.IsStarted = true;
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<LiveRangList> GenerateLiveRangList(int gameRoomId, List<int> userIds)
        {
            var rangList = new LiveRangList
            {
                GameRoomId = gameRoomId,
                LiveRangListParticipants = new List<LiveRangListParticipant>()
            };

            foreach (var userId in userIds)
            {
                rangList.LiveRangListParticipants.Add(new LiveRangListParticipant
                {
                    UserId = userId,
                    Points = 0
                });
            }

            _context.LiveRangLists.Add(rangList);
            await _context.SaveChangesAsync();

            return await _context.LiveRangLists
                .Include(r => r.LiveRangListParticipants)
                .FirstAsync(r => r.Id == rangList.Id);
        }
        public async Task<LiveRangList> GetLiveRangList(int gameRoomId) {
            return await _context.LiveRangLists
                .Include(r => r.LiveRangListParticipants)
                .FirstAsync(r => r.GameRoomId == gameRoomId);
        }
    }
}
