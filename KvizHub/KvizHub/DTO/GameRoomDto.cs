using KvizHub.Models;

namespace KvizHub.DTO
{
    public class GameRoomDto
    {
        public int Id { get; set; }
        public int QuizID { get; set; }
        public int NumberOfUsers { get; set; }
        public bool IsFinished { get; set; }

        public ICollection<RoomParticipantDto>? RoomParticipants { get; set; }

    }
}
