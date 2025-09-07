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
        public async Task<bool> SetIsStartedToFalse(int gameRoomId)
        {
            var gameRoom = await _context.GameRooms.FindAsync(gameRoomId);

            if (gameRoom == null)
                return false;

            gameRoom.IsStarted = false;
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
        public async Task<bool> GivePointToUserIfAnswerIsTrue(int gameRoomId, int userId)
        {
            try
            {
                var liveRangList = await _context.LiveRangLists
                    .Include(lr => lr.LiveRangListParticipants)
                    .FirstOrDefaultAsync(lr => lr.GameRoomId == gameRoomId);

                if (liveRangList == null)
                    return false;

                var participant = liveRangList.LiveRangListParticipants
                    .FirstOrDefault(p => p.UserId == userId);

                if (participant == null)
                    return false;

                participant.Points += 1;

                var result = await _context.SaveChangesAsync();
                return result > 0;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<bool> RemoveGameRoomParticipantsAndLiveRangList(int gameRoomId)
        {
            //Proverim da li svi UserQuizResults imaju SubmittedAt postavljen
            bool allSubmitted = await _context.UserQuizResults
                .Where(uqr => uqr.GameRoomId == gameRoomId)
                .AllAsync(uqr => uqr.SubmittedAt != null);

            if (!allSubmitted)
            {
                //Ako neki korisnik nije zavrsio quiz vrati false
                return false;
            }

            //koristim transakciju da ukoliko nesto pukne od brisanja mogu vratiti bazu u prethodno stanje
            using var tx = await _context.Database.BeginTransactionAsync();
            try
            {
                //Obrisem sve RoomParticipants
                await _context.RoomParticipants
                    .Where(rp => rp.GameRoomId == gameRoomId)
                    .ExecuteDeleteAsync();

                //Pronadjem live rang listu
                var liveRangList = await _context.LiveRangLists
                    .FirstOrDefaultAsync(lr => lr.GameRoomId == gameRoomId);

                if (liveRangList != null)
                {
                    //Obrisem sve njegove participante
                    await _context.LiveRangListParticipants
                        .Where(p => p.LiveRangListId == liveRangList.Id)
                        .ExecuteDeleteAsync();

                    //Obrisem samu rang listu
                    await _context.LiveRangLists
                        .Where(lr => lr.Id == liveRangList.Id)
                        .ExecuteDeleteAsync();
                }

                await tx.CommitAsync();
                return true;
            }
            catch
            {
                await tx.RollbackAsync();
                return false;
            }
        }
        public async Task<bool> HaveAllUsersInGameRoomFinishedQuiz(int gameRoomId) 
        {
            bool allSubmitted = await _context.UserQuizResults
                .Where(uqr => uqr.GameRoomId == gameRoomId)
                .AllAsync(uqr => uqr.SubmittedAt != null);

            if (!allSubmitted)
            {
                return false;
            }
            else {
                return true;
            }
        }

        public async Task<List<User>> GetUsersByRangListId(int liveRangListId)
        {
            return await _context.LiveRangListParticipants
                .Where(p => p.LiveRangListId == liveRangListId)
                .Include(p => p.User)
                .Select(p => p.User)
                .ToListAsync();
        }

        public async Task<bool> DeleteGameRoom(int gameRoomId)
        {
            try
            {
                var gameRoom = await _context.GameRooms.FindAsync(gameRoomId);
                if (gameRoom == null)
                    return false;

                _context.GameRooms.Remove(gameRoom);
                await _context.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }

    }
}
