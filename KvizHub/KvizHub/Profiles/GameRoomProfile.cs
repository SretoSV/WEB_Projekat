using AutoMapper;
using KvizHub.DTO;
using KvizHub.Models;

namespace KvizHub.Profiles
{
    public class GameRoomProfile : Profile
    {
        public GameRoomProfile()
        {
            CreateMap<GameRoom, GameRoomDto>();

            CreateMap<GameRoomDto, GameRoom>()
                .ForMember(dest => dest.Id, opt => opt.Ignore());

            CreateMap<RoomParticipant, RoomParticipantDto>();
        }
    }
}
