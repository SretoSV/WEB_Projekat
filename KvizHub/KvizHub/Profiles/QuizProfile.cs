using AutoMapper;
using KvizHub.DTO;
using KvizHub.Models;

namespace KvizHub.Profiles
{
    public class QuizProfile : Profile
    {
        public QuizProfile() {
            CreateMap<QuizDto, Quiz>()
            .ForMember(dest => dest.AllQuizCategories, opt => opt.Ignore())
            .ForMember(dest => dest.Questions, opt => opt.Ignore())
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Results, opt => opt.Ignore());

            CreateMap<Quiz, QuizDto>()
                .ForMember(dest => dest.AllQuizCategories,
                    opt => opt.MapFrom(src => src.AllQuizCategories.Select(ac => ac.QuizCategory)))
                .ForMember(dest => dest.Questions, opt => opt.MapFrom(src => src.Questions))
                .ForMember(dest => dest.Results, opt => opt.MapFrom(src => src.Results));

            CreateMap<UserQuizResult, UserQuizResultDto>()
                .ForMember(dest => dest.Answers, opt => opt.MapFrom(src => src.Answers))
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.UserId))
                .ForMember(dest => dest.QuizId, opt => opt.MapFrom(src => src.QuizId))
                .ForMember(dest => dest.TotalQuestions, opt => opt.MapFrom(src => src.TotalQuestions))
                .ForMember(dest => dest.CorrectAnswers, opt => opt.MapFrom(src => src.CorrectAnswers))
                .ForMember(dest => dest.ScorePercentage, opt => opt.MapFrom(src => src.ScorePercentage))
                .ForMember(dest => dest.StartedAt, opt => opt.MapFrom(src => src.StartedAt))
                .ForMember(dest => dest.SubmittedAt, opt => opt.MapFrom(src => src.SubmittedAt))
                .ForMember(dest => dest.IsStarted, opt => opt.MapFrom(src => src.IsStarted))
                .ForSourceMember(src => src.User, opt => opt.DoNotValidate())
                .ForSourceMember(src => src.Quiz, opt => opt.DoNotValidate());

            CreateMap<UserAnswer, UserAnswerDto>();

            /*
            CreateMap<QuizDto, Quiz>()
            .ForMember(dest => dest.AllQuizCategories,
                opt => opt.MapFrom(src =>
                    src.AllQuizCategories.Select(qc => new AllQuizCategories
                    {
                        QuizCategoryId = qc.Id
                    }).ToList()
                ))
            .ForMember(dest => dest.Questions, opt => opt.Ignore())
            .ForMember(dest => dest.Id, opt => opt.Ignore());
            */
        }
    }
}
