namespace KvizHub.Models
{
    public class RoomParticipant
    {
        public int Id { get; set; }
        public int GameRoomId { get; set; }
        public GameRoom GameRoom { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }

    }
}
