namespace KvizHub.Models
{
    public class LiveRangListParticipant
    {
        public int Id { get; set; }
        public int LiveRangListId { get; set; }
        public LiveRangList LiveRangList { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public int Points { get; set; }

    }
}
