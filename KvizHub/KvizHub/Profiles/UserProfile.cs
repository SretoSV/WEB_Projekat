using AutoMapper;
using KvizHub.DTO;
using KvizHub.Models;

namespace KvizHub.Profiles
{
    public class UserProfile : Profile
    {
        public UserProfile()
        {
            CreateMap<User, UserLoginResponseDto>()
                .ForMember(dest => dest.IsAdmin, opt => opt.Ignore())
                .ForMember(dest => dest.Token, opt => opt.Ignore())
                .ForMember(dest => dest.ProfileImage, opt => opt.MapFrom(src =>
                    src.ProfileImage != null ? Convert.ToBase64String(src.ProfileImage) : null));

            CreateMap<RegisterUserDto, User>()
            .ForMember(dest => dest.ProfileImage, opt => opt.MapFrom(src =>
                src.ProfileImage != null ? ConvertFormFileToByteArray(src.ProfileImage) : null
            ))
            .ForMember(dest => dest.IsAdmin, opt => opt.MapFrom(_ => false))
            .ForMember(dest => dest.PasswordHash, opt => opt.Ignore())
            .ForMember(dest => dest.QuizResults, opt => opt.Ignore());

            CreateMap<User, UserProfileForRanglistDto>();
        }

        #region Helpers
        private static byte[]? ConvertFormFileToByteArray(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return null;

            using var ms = new MemoryStream();
            file.CopyTo(ms);
            return ms.ToArray();
        }
        #endregion
    }
}
