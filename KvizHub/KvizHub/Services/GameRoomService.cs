using System.Collections.Generic;
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

        public GameRoomService(IGameRoomDao gameRoomDao, IUserDao userDao, IMapper mapper)
        {
            _gameRoomDao = gameRoomDao;
            _userDao = userDao;
            _mapper = mapper;
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
    }
}
