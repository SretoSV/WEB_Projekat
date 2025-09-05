using KvizHub.Models;

namespace KvizHub.DTO
{
    public class LiveRangListParticipantDto
    {
        public int Id { get; set; }
        public int LiveRangListId { get; set; }
        public int UserId { get; set; }
        public int Points { get; set; }
    }
}
