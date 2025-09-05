using KvizHub.Models;

namespace KvizHub.DTO
{
    public class LiveRangListDto
    {
        public int Id { get; set; }
        public int GameRoomId { get; set; }

        public ICollection<LiveRangListParticipantDto> LiveRangListParticipants { get; set; }
    }
}
