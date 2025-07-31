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
            quiz.Id = 0;

            quiz.Questions = null;
            quiz.AllQuizCategories = null;
            quiz.Results = null;

            quiz = await _quizDao.AddQuizAsync(quiz); //dodam quiz u bazu i dobijem id

            if (quiz == null || quiz.Id <= 0)
            {
                return null;
            }

            dto.Id = quiz.Id;

            await SetFields(dto, quiz.Id);

            return dto;
        }

        public async Task<QuizDto> EditQuiz(QuizDto dto, int id)
        {
            if (await _quizDao.EditQuizFields(dto, id))
            {
                await _quizDao.ClearQuizDependenciesAsync(id);
                await SetFields(dto, id);
            }
            else {
                return null;
            }
            return dto;
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

        #region Helpers
        private async Task SetFields(QuizDto dto, int quizId) {
            await _quizDao.AddQuizCategoriesAsync(dto.AllQuizCategories);
            List<QuizCategory> categoriesIds = await _quizDao.GetQuizCategoriesByQuizCategoryNameAsync(dto.AllQuizCategories);
            await _quizDao.AddCategoryIdsToAllQuizCategoriesTableByQuizId(quizId, categoriesIds);

            var nameIdMap = categoriesIds.ToDictionary(cat => cat.Name.ToLower(), cat => cat.Id);
            foreach (var dtoCat in dto.AllQuizCategories)
            {
                var nameKey = dtoCat.Name.ToLower();

                if (nameIdMap.TryGetValue(nameKey, out int id))
                {
                    dtoCat.Id = id;
                }
            }

            foreach (var question in dto.Questions)
            {
                question.QuizId = quizId;
            }

            List<Question> questionsFromDatabase = await _quizDao.AddQuestionsAsync(dto.Questions);

            var dtoList = dto.Questions.ToList();
            var dbList = questionsFromDatabase.ToList();

            for (int i = 0; i < dtoList.Count; i++)
            {
                dtoList[i].Id = dbList[i].Id;
            }

            dto.Questions = dtoList;

            foreach (var question in dto.Questions)
            {
                foreach (var answer in question.AnswerOptions)
                {
                    answer.QuestionId = question.Id;
                }

            }

            await _quizDao.AddAnswerOptionsAsync(dto.Questions.ToList());
        }
        #endregion
    }
}
