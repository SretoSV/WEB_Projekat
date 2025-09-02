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
        private readonly IQuestionDao _questionDao;
        private readonly IUserDao _userDao;
        private readonly ICategoryDao _categoryDao;
        private readonly IResultDao _resultDao;
        private readonly IAnswerDao _answerDao;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public QuizService(IQuizDao quizDao, IQuestionDao questionDao, IUserDao userDao, ICategoryDao categoryDao, IResultDao resultDao, IAnswerDao answerDao, IMapper mapper, IHttpContextAccessor httpContextAccessor)
        {
            _quizDao = quizDao;
            _questionDao = questionDao;
            _userDao = userDao;
            _categoryDao = categoryDao;
            _resultDao = resultDao;
            _answerDao = answerDao;
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<bool> DoesQuizTitleExist(string title)
        {
            return await _quizDao.DoesQuizTitleExistAsync(title);
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
        public async Task<UserQuizResultDto> StartQuiz(int quizId) 
        {
            int userId = GetUserId();
            UserQuizResult userQuizResult = await _quizDao.StartQuiz(quizId, userId);
            UserQuizResultDto userQuizResultDto = _mapper.Map<UserQuizResultDto>(userQuizResult);
            List<Question> questions = await _questionDao.GetQuestionsByQuizId(quizId);

            List<UserAnswer> userAnswers = await _answerDao.CreateUserAnswers(quizId, userQuizResult.Id, questions, userId);
            userQuizResultDto.Answers = _mapper.Map<List<UserAnswerDto>>(userAnswers);

            return userQuizResultDto;
        }

        public async Task<UserQuizResultDto> FinishQuiz(UserQuizResultDto userQuizResultDto)
        {
            userQuizResultDto.SubmittedAt = DateTime.UtcNow;
            userQuizResultDto.TotalQuestions = userQuizResultDto.Answers.Count;
            userQuizResultDto.CorrectAnswers = 0;
            userQuizResultDto.ScorePercentage = 0;
            userQuizResultDto.IsStarted = false;

            List <UserAnswerDto> userAnswerDtos = userQuizResultDto.Answers.ToList();
            List<Question> questions = await _questionDao.GetQuestionsByQuizId(userQuizResultDto.QuizId);
            bool isTrue;

            for (int i = 0; i < questions.Count; i++) {
                isTrue = true;
                List<AnswerOption> questionAnswerOptions = questions[i].AnswerOptions.ToList();
                List<UserAnswerOptionDto> userAnswerOptions = userAnswerDtos[i].UserAnswerOptions.ToList();

                for (int j = 0; j < questionAnswerOptions.Count; j++) {
                    bool isMultiple = await _questionDao.IsQuestionTypeMultipleCorrectAnswers(userAnswerDtos[i].QuestionId);
                    if (isMultiple)
                    {
                        if (userAnswerOptions[j].IsCorrect == null) { userAnswerOptions[j].IsCorrect = false; }
                    }

                    if (questionAnswerOptions[j].FieldAnswerText != null) {
                        if (!questionAnswerOptions[j].FieldAnswerText.Equals(userAnswerOptions[j].FieldAnswerText, StringComparison.OrdinalIgnoreCase))
                        {
                            isTrue = false;
                            userAnswerDtos[i].IsTrue = false;
                            break;
                        }
                        else { 
                            userAnswerOptions[j].IsCorrect = true;
                            break;
                        }
                    }
                    else if(questionAnswerOptions[j].IsCorrect != userAnswerOptions[j].IsCorrect) { //ako je neki od optiona razlicit pitanje postaje netacno
                        isTrue = false;
                        userAnswerDtos[i].IsTrue = false;
                    }
                }
                if (isTrue) { 
                    userAnswerDtos[i].IsTrue = true;
                    userQuizResultDto.CorrectAnswers++;
                }
            }

            if (userQuizResultDto.CorrectAnswers != 0) {
                userQuizResultDto.ScorePercentage = (double.Parse(userQuizResultDto.CorrectAnswers.ToString()) / userAnswerDtos.Count) * 100;
            }

            //UPISI SVE U BAZU
            UserQuizResult userQuizResult = _mapper.Map<UserQuizResult>(userQuizResultDto);

            if (!await _quizDao.FinishQuiz(userQuizResult)) {
                return null;
            }

            return userQuizResultDto;
        }

        public async Task<List<QuizTitleDto>> GetAllUserQuizzes(string username)
        {
            User user = await _userDao.GetUserByUsernameOrEmailAsync(username);

            List<Quiz> quizzes = await _quizDao.GetAllUserQuizzesAsync(user.Id);
            var quizDtos = _mapper.Map<List<QuizTitleDto>>(quizzes);

            return quizDtos;
        }
        public async Task<List<UserQuizResultDto>> GetAllUserResultsForQuiz(int quizId, string username)
        {
            User user = await _userDao.GetUserByUsernameOrEmailAsync(username);
            
            List<UserQuizResult> results = await _resultDao.GetAllUserResultsForQuiz(quizId, user.Id);
            var quizDtos = _mapper.Map<List<UserQuizResultDto>>(results);
            return quizDtos;
        }

        public async Task<UserQuizResultAndProfileDto> GetAllResultsForQuiz(int quizId)
        {
            List<UserQuizResult> results = await _resultDao.GetAllResultsForQuiz(quizId);
            if (results == null) {
                return null;
            }
            var quizResultsDtos = _mapper.Map<List<UserQuizResultDto>>(results);
            var sortedResults = quizResultsDtos
                .OrderByDescending(r => r.ScorePercentage ?? 0)
                .ThenBy(r => (r.SubmittedAt ?? DateTime.MaxValue) - r.StartedAt)
                .ToList();

            var userIds = results.Select(r => r.UserId).Distinct().ToList();
            List<User> users = await _userDao.GetAllUsersByUsersIds(userIds);
            if (results == null)
            {
                return null;
            }
            var profiles = _mapper.Map<List<UserProfileForRanglistDto>>(users);


            UserQuizResultAndProfileDto userQuizResultAndProfileDto = new UserQuizResultAndProfileDto { 
                Results = sortedResults,
                Profiles = profiles,
            };

            return userQuizResultAndProfileDto;
        }

        #region Helpers
        private async Task SetFields(QuizDto dto, int quizId) {

            List<QuizCategoryDto> startingCategoryList = dto.AllQuizCategories
            .Select(c => new QuizCategoryDto
            {
                Id = c.Id,
                Name = c.Name,
            })
            .ToList();

            await _categoryDao.AddQuizCategoriesAsync(dto.AllQuizCategories);
            List<QuizCategory> categoriesIds = await _categoryDao.GetQuizCategoriesByQuizCategoryNameAsync(dto.AllQuizCategories);

            foreach (var dtoCat in startingCategoryList)
            {
                Console.WriteLine("\n" + dtoCat.Id + " " + dtoCat.Name);
            }

            await _categoryDao.AddCategoryIdsToAllQuizCategoriesTableByQuizId(quizId, categoriesIds);

            var nameIdMap = categoriesIds.ToDictionary(cat => cat.Name.ToLower(), cat => cat.Id);
            foreach (var dtoCat in dto.AllQuizCategories)
            {
                var nameKey = dtoCat.Name.ToLower();

                if (nameIdMap.TryGetValue(nameKey, out int id))
                {
                    dtoCat.Id = id;
                }
            }
            foreach (var dtoCat in dto.AllQuizCategories)
            {
                Console.WriteLine("\n" + dtoCat.Id +" " + dtoCat.Name);
            }
            Console.WriteLine("\n-----------------------------");

            foreach (var question in dto.Questions)
            {
                //Pronadji originalnu kategoriju iz startingCategoryList po ID-u
                var originalCategory = startingCategoryList
                    .FirstOrDefault(c => c.Id == question.QuizCategoryId);

                //Pronadji azuriranu kategoriju po imenu u dto.AllQuizCategories
                var updatedCategory = dto.AllQuizCategories
                    .FirstOrDefault(c => c.Name.Equals(originalCategory.Name, StringComparison.OrdinalIgnoreCase));

                //Dodeli novi ID
                question.QuizCategoryId = updatedCategory.Id;
                question.QuizId = quizId;
            }


            List<Question> questionsFromDatabase = await _questionDao.AddQuestionsAsync(dto.Questions);

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

            await _answerDao.AddAnswerOptionsAsync(dto.Questions.ToList());
        }

        private int GetUserId()
        {
            var claim = _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier);
            return int.Parse(claim?.Value ?? throw new Exception("User ID not found in claims"));
        }
        #endregion
    }
}
