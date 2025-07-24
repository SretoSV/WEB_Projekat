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

        public async Task<Quiz> AddQuiz(QuizDto dto)
        {
            return new Quiz();
        }

        public async Task<Quiz> EditQuiz(int id)
        {
            return new Quiz();
        }
        public async Task<Quiz> DeleteQuiz(int id)
        {
            return new Quiz();
        }

        public async Task<List<Quiz>> GetLastXQuizzes(int limit, DateTime? before)
        {
            return new List<Quiz>();
        }
    }
}
