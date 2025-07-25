using AutoMapper;
using KvizHub.DTO;
using KvizHub.Models;

namespace KvizHub.Profiles
{
    public class QuizCategoryProfile : Profile
    {
        public QuizCategoryProfile()
        {
            CreateMap<QuizCategory, QuizCategoryDto>();
        }
    }
}
