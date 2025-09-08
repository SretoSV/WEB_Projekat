namespace KvizHub.Models
{
    public class AnswerInteraction
    {
        public int Id { get; set; }
        public int GameRoomId { get; set; }
        public GameRoom GameRoom { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public DateTime? ClickedAt { get; set; }
        public bool? IsTrue { get; set; }

    }
}
