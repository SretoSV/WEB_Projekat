using AutoMapper;
using KvizHub.DTO;
using KvizHub.Models;

namespace KvizHub.Profiles
{
    public class QuizProfile : Profile
    {
        public QuizProfile() {
            CreateMap<QuizDto, Quiz>()
            .ForMember(dest => dest.AllQuizCategories,
                opt => opt.MapFrom(src =>
                    src.AllQuizCategories.Select(qc => new AllQuizCategories
                    {
                        QuizCategoryId = qc.Id
                    }).ToList()
                ));

            CreateMap<Quiz, QuizDto>()
                .ForMember(dest => dest.AllQuizCategories,
                    opt => opt.MapFrom(src => src.AllQuizCategories.Select(ac => ac.QuizCategory)))
                .ForMember(dest => dest.Questions, opt => opt.MapFrom(src => src.Questions))
                .ForMember(dest => dest.Results, opt => opt.MapFrom(src => src.Results));
        }
    }
}
