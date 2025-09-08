using System.Collections.Generic;
using System.Diagnostics;
using AutoMapper;
using KvizHub.DAO;
using KvizHub.DAO.Implementations;
using KvizHub.DTO;
using KvizHub.Models;
using KvizHub.Services.Interfaces;

namespace KvizHub.Services
{
    public class GameRoomService : IGameRoomService
    {
        private readonly IGameRoomDao _gameRoomDao;
        private readonly IUserDao _userDao;
        private readonly IMapper _mapper;
        private readonly IQuizDao _quizDao;
        private readonly IQuestionDao _questionDao;
        private readonly IAnswerDao _answerDao;
        private readonly IResultDao _resultDao;

        public GameRoomService(IGameRoomDao gameRoomDao, IUserDao userDao, IMapper mapper, IQuizDao quizDao, IQuestionDao questionDao, IAnswerDao answerDao, IResultDao resultDao)
        {
            _gameRoomDao = gameRoomDao;
            _userDao = userDao;
            _mapper = mapper;
            _quizDao = quizDao;
            _questionDao = questionDao;
            _answerDao = answerDao;
            _resultDao = resultDao;
        }

        public async Task<List<GameRoomDto>> GetAllGameRooms()
        {
            List<GameRoom> gameRooms = await _gameRoomDao.GetAllGameRoomsAsync();
            var roomsDtos = _mapper.Map<List<GameRoomDto>>(gameRooms);
            foreach (var roomsDto in roomsDtos) {               
                
                var userIds = roomsDto.RoomParticipants.Select(r => r.UserId).Distinct().ToList();
                List<User> users = await _userDao.GetAllUsersByUsersIds(userIds);
                var profiles = _mapper.Map<List<UserProfileForRanglistDto>>(users);

                foreach (var dto in roomsDto.RoomParticipants) {
                    dto.UserProfile = profiles.FirstOrDefault(p => p.Id == dto.UserId);
                }
            }

            return roomsDtos;
        }

        public async Task<List<int>> GetUserIdsForGameRoom(int gameRoomId)
        {
            return await _gameRoomDao.GetUserIdsForGameRoom(gameRoomId);
        }
        public async Task<GameRoomDto> AddGameRoom(GameRoomDto dto)
        {
            GameRoom gameRoom = _mapper.Map<GameRoom>(dto); //dobijem room iz dto
            gameRoom.Id = 0;
            gameRoom.NumberOfUsers = 0;
            gameRoom.IsFinished = false;
            gameRoom.RoomParticipants = [];

            gameRoom = await _gameRoomDao.AddGameRoomAsync(gameRoom);

            if (gameRoom == null || gameRoom.Id <= 0)
            {
                return null;
            }

            dto.Id = gameRoom.Id;

            return dto;
        }
        public async Task<RoomParticipantDto> JoinGameRoom(int gameRoomId, string userUsername)
        {
            var user = await _userDao.GetUserByUsernameOrEmailAsync(userUsername);
            RoomParticipant roomParticipant = new RoomParticipant { UserId = user.Id, GameRoomId = gameRoomId };

            var existingParticipant = await _gameRoomDao.IsUserExistsInGameRoom(gameRoomId, user.Id);

            if (existingParticipant != null)
            {
                return null;
            }

            var newRoomParticipant = await _gameRoomDao.AddUserToGameRoom(roomParticipant);

            return new RoomParticipantDto { 
                Id = newRoomParticipant.Id, 
                GameRoomId = gameRoomId, 
                UserId = user.Id, 
                UserProfile = new UserProfileForRanglistDto { Id = user.Id, Username = userUsername, ProfileImage = user.ProfileImage }
            };
        }
        public async Task<int> LeaveGameRoom(int gameRoomId, string userUsername)
        {
            var user = await _userDao.GetUserByUsernameOrEmailAsync(userUsername);
            var existingParticipant = await _gameRoomDao.IsUserExistsInGameRoom(gameRoomId, user.Id);

            if (existingParticipant == null)
            {
                return -1;
            }

            if (await _gameRoomDao.RemoveUserFromGameRoom(existingParticipant.Id)) {
                return existingParticipant.Id;
            }

            return -1;
        }
        public async Task<UserQuizResultDto> StartQuiz(int quizId, int userId, int gameRoomId)
        {
            await _gameRoomDao.SaveEmptyAnswerInteraction(gameRoomId, userId);
            UserQuizResult userQuizResult = await _quizDao.StartQuiz(quizId, userId, gameRoomId);
            UserQuizResultDto userQuizResultDto = _mapper.Map<UserQuizResultDto>(userQuizResult);
            List<Question> questions = await _questionDao.GetQuestionsByQuizId(quizId);

            List<UserAnswer> userAnswers = await _answerDao.CreateUserAnswers(quizId, userQuizResult.Id, questions, userId);
            userQuizResultDto.Answers = _mapper.Map<List<UserAnswerDto>>(userAnswers);
            userQuizResultDto.GameRoomId = gameRoomId;
            return userQuizResultDto;
        }
        public async Task<bool> SetIsStartedToTrue(int gameRoomId)
        {
            return await _gameRoomDao.SetIsStartedToTrue(gameRoomId);
        }
        public async Task<bool> SetIsStartedToFalse(int gameRoomId)
        {
            return await _gameRoomDao.SetIsStartedToFalse(gameRoomId);
        }

        public async Task<LiveRangListDto> GenerateLiveRangList(int gameRoomId, List<int> userIds)
        {
            LiveRangList liveRangList = await _gameRoomDao.GenerateLiveRangList(gameRoomId, userIds);
            return _mapper.Map<LiveRangListDto>(liveRangList);
        }
        public async Task<LiveRangListDto> GetLiveRangList(int gameRoomId)
        {
            LiveRangList liveRangList = await _gameRoomDao.GetLiveRangList(gameRoomId);
            if (liveRangList == null)
                return null;

            liveRangList.LiveRangListParticipants = liveRangList.LiveRangListParticipants
                .OrderByDescending(p => p.Points)
                .ToList();
            return _mapper.Map<LiveRangListDto>(liveRangList);
        }
        
        public async Task<bool> CompareAnswer(int gameRoomId, UserQuizResultDto userQuizResultDto, int currentAnswerIndex)
        {
            List<AnswerInteraction> answerInteractions = await _gameRoomDao.GetAllAnswerInteractionsForGameRoom(gameRoomId);
            List<Question> questions = await _questionDao.GetQuestionsByQuizId(userQuizResultDto.QuizId);
            List<UserAnswerDto> userAnswerDtos = userQuizResultDto.Answers.ToList();

            #region Comapration
            bool isTrue = true;
            List<AnswerOption> questionAnswerOptions = questions[currentAnswerIndex].AnswerOptions.ToList();
            List<UserAnswerOptionDto> userAnswerOptions = userAnswerDtos[currentAnswerIndex].UserAnswerOptions.ToList();

            for (int j = 0; j < questionAnswerOptions.Count; j++)
            {
                bool isMultiple = await _questionDao.IsQuestionTypeMultipleCorrectAnswers(userAnswerDtos[currentAnswerIndex].QuestionId);
                if (isMultiple)
                {
                    if (userAnswerOptions[j].IsCorrect == null) { userAnswerOptions[j].IsCorrect = false; }
                }

                if (questionAnswerOptions[j].FieldAnswerText != null)
                {
                    if (!questionAnswerOptions[j].FieldAnswerText.Equals(userAnswerOptions[j].FieldAnswerText, StringComparison.OrdinalIgnoreCase))
                    {
                        isTrue = false;
                        userAnswerDtos[currentAnswerIndex].IsTrue = false;
                        break;
                    }
                    else
                    {
                        userAnswerOptions[j].IsCorrect = true;
                        break;
                    }
                }
                else if (questionAnswerOptions[j].IsCorrect != userAnswerOptions[j].IsCorrect)
                { //ako je neki od optiona razlicit pitanje postaje netacno
                    isTrue = false;
                    userAnswerDtos[currentAnswerIndex].IsTrue = false;
                }
            }
            if (isTrue)
            {
                userAnswerDtos[currentAnswerIndex].IsTrue = true;
            }
            #endregion

            UserAnswer userAnswer = _mapper.Map<UserAnswer>(userAnswerDtos[currentAnswerIndex]);
            bool save = await _quizDao.SaveUserAnswerToDatabase(userAnswer);
            bool give = true;
            if (userAnswerDtos[currentAnswerIndex].IsTrue && save)
            {
                //daj bod tom korisniku za tu rang listu 
                give = await _gameRoomDao.GivePointToUserIfAnswerIsTrue(gameRoomId, userQuizResultDto.UserId);
            }

            #region FastestAnswerPoint
            if (userAnswerDtos[currentAnswerIndex].IsTrue)
            {
                await _gameRoomDao.SetIsTrueToAnswerInteraction(gameRoomId, userQuizResultDto.UserId, true);
            }
            else 
            {
                await _gameRoomDao.SetIsTrueToAnswerInteraction(gameRoomId, userQuizResultDto.UserId, false);
            }

            bool giveFastestPoint = true;
            if (await _gameRoomDao.CheckAllAnswerInteractionsIsTrueFiled(gameRoomId)) 
            {
                var userId = await _gameRoomDao.GetFastestCorrectUserId(gameRoomId);
                if (userId != null) 
                { 
                    giveFastestPoint = await _gameRoomDao.GivePointToUserIfAnswerIsTrue(gameRoomId, userId.Value);
                }

                await _gameRoomDao.SetIsTrueAndClickedAtToNull(gameRoomId);
            }
            #endregion

            return save && give && giveFastestPoint;
        }

        public async Task<UserQuizResultDto> GetUserQuizResultById(UserQuizResultDto userQuizResultDto)
        {
            userQuizResultDto.SubmittedAt = DateTime.UtcNow;

            UserQuizResult userQuizResult = await _resultDao.GetUserQuizResultById(userQuizResultDto.Id);

            userQuizResult.SubmittedAt = userQuizResultDto.SubmittedAt;
            userQuizResult.TotalQuestions = userQuizResultDto.Answers.Count;
            userQuizResult.CorrectAnswers = userQuizResult.Answers.Count(a => a.IsTrue);
            userQuizResult.ScorePercentage = 0;
            userQuizResult.IsStarted = false;
            if (userQuizResult.CorrectAnswers != 0)
            {
                userQuizResult.ScorePercentage = (double.Parse(userQuizResult.CorrectAnswers.ToString()) / userQuizResult.TotalQuestions) * 100;
            }
            if (await _quizDao.SaveUserQuizResultToDatabase(userQuizResult)) 
            {
                return _mapper.Map<UserQuizResultDto>(userQuizResult);
            }
            return null;
        }
        public async Task<UserQuizResultDto> GETUserQuizResultById(UserQuizResultDto userQuizResultDto)
        {

            UserQuizResult userQuizResult = await _resultDao.GetUserQuizResultById(userQuizResultDto.Id);
            return _mapper.Map<UserQuizResultDto>(userQuizResult);

        }

        public async Task<bool> RemoveGameRoomParticipantsAndLiveRangList(int gameRoomId)
        {
            var d = await _gameRoomDao.RemoveGameRoomParticipantsAndLiveRangList(gameRoomId);
            return d;
        }

        public async Task<bool> HaveAllUsersInGameRoomFinishedQuiz(int gameRoomId) 
        {
            return await _gameRoomDao.HaveAllUsersInGameRoomFinishedQuiz(gameRoomId); 
        }

        public async Task<List<UserProfileForRanglistDto>> GetUsersProfilesByRangListId(int liveRangListId)
        {
            List<User> users = await _gameRoomDao.GetUsersByRangListId(liveRangListId);

            List<UserProfileForRanglistDto> roomParticipantDtos = users
                .Select(u => new UserProfileForRanglistDto
                {
                    Id = u.Id,
                    Username = u.Username,
                    ProfileImage = u.ProfileImage
                })
                .ToList();

            return roomParticipantDtos;
        }

        public async Task<bool> DeleteGameRoom(int gameRoomId)
        {
            return await _gameRoomDao.DeleteGameRoom(gameRoomId);
        }

        public async Task SaveAnswerInteraction(int gameRoomId, string username) 
        {
            var clickedAt = DateTime.UtcNow;
            var userId = await _userDao.GetUserIdByUsername(username);
            await _gameRoomDao.SaveAnswerInteraction(gameRoomId, userId, clickedAt);
        }
    }
}
