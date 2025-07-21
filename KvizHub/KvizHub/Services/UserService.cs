using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AutoMapper;
using KvizHub.Context;
using KvizHub.DAO;
using KvizHub.DAO.Implementations;
using KvizHub.DTO;
using KvizHub.Models;
using KvizHub.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace KvizHub.Services
{
    public class UserService : IUserService
    {
        private readonly IConfigurationSection _secretKey;
        private readonly IUserDao _userDao;
        private readonly IMapper _mapper;
        private readonly IPasswordHasher<User> _passwordHasher;

        public UserService(IConfiguration config, IUserDao userDao, IMapper mapper, IPasswordHasher<User> passwordHasher)
        {
            _secretKey = config.GetSection("SecretKey");
            _userDao = userDao;
            _mapper = mapper;
            _passwordHasher = passwordHasher;
        }

        public async Task<UserLoginResponseDto> Login(LoginUserDto dto)
        {
            User user = await _userDao.GetUserByUsernameOrEmailAsync(dto.UsernameOrEmail);

            if (user == null)
                return null;

            var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, dto.Password);


            if (result == PasswordVerificationResult.Success)
            {
                List<Claim> claims = new List<Claim>();
                
                if (dto.UsernameOrEmail == "anaanic@gmail.com" || dto.UsernameOrEmail == "Ana123")
                    claims.Add(new Claim(ClaimTypes.Role, "admin"));
                else
                    claims.Add(new Claim(ClaimTypes.Role, "user"));

                SymmetricSecurityKey secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey.Value));
                var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
                var tokeOptions = new JwtSecurityToken(
                    issuer: "http://localhost:5213", 
                    claims: claims, 
                    expires: DateTime.Now.AddMinutes(20), 
                    signingCredentials: signinCredentials 
                );
                string tokenString = new JwtSecurityTokenHandler().WriteToken(tokeOptions);

                var responseDto = _mapper.Map<UserLoginResponseDto>(user);
                responseDto.IsAdmin = user.IsAdmin;
                responseDto.Token = tokenString;

                return responseDto;
            }
            else
            {
                return null;
            }
        }

        public async Task<bool> Register(RegisterUserDto dto)
        {
            var exists = await _userDao.UserExists(dto.Email, dto.Username);
            if (exists)
                return false;

            User user = _mapper.Map<User>(dto);
            user.PasswordHash = _passwordHasher.HashPassword(user, dto.Password);

            return await _userDao.RegisterUser(user);
        }
    }
}
