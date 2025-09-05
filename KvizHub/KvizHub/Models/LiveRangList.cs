namespace KvizHub.Models
{
    public class LiveRangList
    {
        public int Id { get; set; }
        public int GameRoomId { get; set; }
        public GameRoom GameRoom { get; set; }

        public ICollection<LiveRangListParticipant> LiveRangListParticipants { get; set; }
    }
}
