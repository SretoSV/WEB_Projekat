using AutoMapper;
using KvizHub.DAO;
using KvizHub.DTO;
using KvizHub.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using KvizHub.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using KvizHub.DAO.Implementations;

namespace KvizHub.Services
{
    public class QuizService : IQuizService
    {
        private readonly IQuizDao _quizDao;
        private readonly IMapper _mapper;

        public QuizService(IQuizDao quizDao, IMapper mapper)
        {
            _quizDao = quizDao;
            _mapper = mapper;
        }

        public async Task<QuizDto> AddQuiz(QuizDto dto)
        {
            Quiz quiz = _mapper.Map<Quiz>(dto); //dobijem quiz bez id-a
            quiz = await _quizDao.AddQuizAsync(quiz); //dodam quiz u bazu i dobijem id
            dto.Id = quiz.Id;

            if (quiz == null || quiz.Id <= 0)
            {
                return null;
            }

            foreach (var ac in quiz.AllQuizCategories)
            {
                ac.QuizId = quiz.Id;
            }

            quiz = await _quizDao.SaveAllQuizCategoriesAsync(quiz);

            return dto;
        }

        public async Task<Quiz> EditQuiz(int id)
        {
            return new Quiz();
        }
        public async Task<int> DeleteQuiz(int id)
        {
            if (await _quizDao.DeleteQuizByIdAsync(id))
            {
                return id;
            }
            else { 
                return 0;
            }
        }

        public async Task<List<QuizDto>> GetAllQuizzes()
        {
            List<Quiz> quizzes = await _quizDao.GetAllQuizzesAsync();
            var quizDtos = _mapper.Map<List<QuizDto>>(quizzes);
            return quizDtos;
        }
    }
}
