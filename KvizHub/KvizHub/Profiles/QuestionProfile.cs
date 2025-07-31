using AutoMapper;
using KvizHub.DTO;
using KvizHub.Models;

namespace KvizHub.Profiles
{
    public class QuestionProfile : Profile
    {
        public QuestionProfile() {
            CreateMap<QuestionDto, Question>()
            .ForMember(dest => dest.AnswerOptions, opt => opt.MapFrom(src => src.AnswerOptions))
            .ForMember(dest => dest.Text, opt => opt.MapFrom(src => src.Text))
            .ForMember(dest => dest.QuestionTypeId, opt => opt.MapFrom(src => src.QuestionTypeId))
            .ForMember(dest => dest.QuizCategoryId, opt => opt.MapFrom(src => src.QuizCategoryId))
            .ForMember(dest => dest.QuestionDifficultyId, opt => opt.MapFrom(src => src.QuestionDifficultyId))
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id));

            CreateMap<AnswerOptionDto, AnswerOption>();

            CreateMap<Question, QuestionDto>()
            .ForMember(dest => dest.AnswerOptions, opt => opt.MapFrom(src => src.AnswerOptions))
            .ForMember(dest => dest.Text, opt => opt.MapFrom(src => src.Text))
            .ForMember(dest => dest.QuestionTypeId, opt => opt.MapFrom(src => src.QuestionTypeId))
            .ForMember(dest => dest.QuizCategoryId, opt => opt.MapFrom(src => src.QuizCategoryId))
            .ForMember(dest => dest.QuestionDifficultyId, opt => opt.MapFrom(src => src.QuestionDifficultyId))
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id));

            CreateMap<AnswerOption, AnswerOptionDto>();

        }
    }
}
