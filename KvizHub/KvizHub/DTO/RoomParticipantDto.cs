using KvizHub.Models;

namespace KvizHub.DTO
{
    public class RoomParticipantDto
    {
        public int Id { get; set; }
        public int GameRoomId { get; set; }
        public int UserId { get; set; }
        public UserProfileForRanglistDto UserProfile { get; set; }

    }
}
