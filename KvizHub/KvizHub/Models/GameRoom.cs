using KvizHub.DTO;

namespace KvizHub.Models
{
    public class GameRoom
    {
        public int Id { get; set; }
        public int QuizID { get; set; }
        public Quiz Quiz { get; set; }
        public int NumberOfUsers { get; set; }
        public bool IsStarted { get; set; }
        public bool IsFinished { get; set; }

        public ICollection<RoomParticipant> RoomParticipants { get; set; }
        public ICollection<UserQuizResult> UserQuizResults { get; set; }
    }
}
