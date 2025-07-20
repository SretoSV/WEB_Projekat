using AutoMapper;
using KvizHub.DTO;
using KvizHub.Models;

namespace KvizHub.Profiles
{
    public class UserProfile : Profile
    {
        public UserProfile()  // <-- Konstruktor klase
        {
            CreateMap<User, UserLoginResponseDto>()
                .ForMember(dest => dest.IsAdmin, opt => opt.Ignore())
                .ForMember(dest => dest.Token, opt => opt.Ignore())
                .ForMember(dest => dest.ProfileImage, opt => opt.MapFrom(src =>
                    src.ProfileImage != null ? Convert.ToBase64String(src.ProfileImage) : null));
        }
    }
}
