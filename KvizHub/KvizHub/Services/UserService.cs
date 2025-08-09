using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
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
        private readonly IRefreshTokenDao _refreshTokenDao;
        private readonly IMapper _mapper;
        private readonly IPasswordHasher<User> _passwordHasher;

        public UserService(IConfiguration config, IUserDao userDao, IRefreshTokenDao refreshTokenDao, IMapper mapper, IPasswordHasher<User> passwordHasher)
        {
            _secretKey = config.GetSection("SecretKey");
            _userDao = userDao;
            _refreshTokenDao = refreshTokenDao;
            _mapper = mapper;
            _passwordHasher = passwordHasher;
        }

        public async Task<UserLoginResponseDto> Login(LoginUserDto dto, string? ipAddress)
        {
            var ip = GetIpAddress(ipAddress);

            User user = await _userDao.GetUserByUsernameOrEmailAsync(dto.UsernameOrEmail);

            if (user == null)
                return null;

            var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, dto.Password);

            if (result == PasswordVerificationResult.Success)
            {
                List<Claim> claims = new List<Claim>
{
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Name, user.Username),
                    new Claim(ClaimTypes.Role, user.IsAdmin ? "admin" : "user")
                };

                string accessToken = GetAccessToken(claims);

                var responseDto = _mapper.Map<UserLoginResponseDto>(user);
                responseDto.IsAdmin = user.IsAdmin;
                responseDto.Token = accessToken;

                //-------------- refresh token ------------------
                var refreshTokenHash = await GetRefreshToken(ip, user.Id);
                //-----------------------------------------------
                responseDto.RefreshToken = refreshTokenHash;

                return responseDto;
            }
            else
            {
                return null;
            }
        }

        public async Task<UserRegisterResponseDto> Register(RegisterUserDto dto)
        {
            var usernameExists = await _userDao.UserExistsByUsername(dto.Username);
            var emailExists = await _userDao.UserExistsByEmail(dto.Email);

            if (usernameExists)
                return new UserRegisterResponseDto { Success = false, Message = "User with that username already exists." };
            else if(emailExists)
                return new UserRegisterResponseDto { Success = false, Message = "User with that email already exists." };
            

            User user = _mapper.Map<User>(dto);
            user.PasswordHash = _passwordHasher.HashPassword(user, dto.Password);

            return new UserRegisterResponseDto { Success = await _userDao.RegisterUser(user), Message = "User successfully registered." };
        }

        public async Task<List<string>> GetAllUsersUsernames()
        {
            List<string> usernames = await _userDao.GetAllUsersUsernames();
            return usernames;
        }

        public async Task LogoutAsync(string refreshTokenHash)
        {

            if (string.IsNullOrEmpty(refreshTokenHash))
            {
                return;
            }

            var token = await _refreshTokenDao.GetByTokenHashAsync(refreshTokenHash);

            if (token != null)
            {
                await _refreshTokenDao.RemoveAsync(token);
            }
        }

        public async Task<bool> IsTokenActive(string refreshTokenHash)
        {
            return await _refreshTokenDao.IsTokenActive(refreshTokenHash);
        }

        public async Task<AccessAndRefreshTokenDto> GetNewAccessAndRefreshToken(string ipAddress, string refreshTokenHash) {
            var token = await _refreshTokenDao.GetByTokenHashAsync(refreshTokenHash);
            User user = await _userDao.GetUserByIdAsync(token.UserId);

            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.IsAdmin ? "admin" : "user")
            };

            var ip = GetIpAddress(ipAddress);
            string newAccessToken = GetAccessToken(claims);

            var newRefreshTokenHash = await GetRefreshToken(ip, token.UserId);

            return new AccessAndRefreshTokenDto { AccessToken = newAccessToken, RefreshToken = newRefreshTokenHash };
        }

        #region Helpers
        private string GenerateRefreshToken()
        {
            var bytes = new byte[64];
            RandomNumberGenerator.Fill(bytes);
            return Convert.ToBase64String(bytes);
        }
        private string ComputeSha256Hash(string rawData)
        {
            using (SHA256 sha256Hash = SHA256.Create())
            {
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(rawData));
                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < bytes.Length; i++)
                {
                    builder.Append(bytes[i].ToString("x2"));
                }
                return builder.ToString();
            }
        }
        private string GetAccessToken(List<Claim> claims)
        {
            SymmetricSecurityKey secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey.Value));
            var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
            var tokeOptions = new JwtSecurityToken(
                issuer: "http://localhost:5213",
                claims: claims,
                expires: DateTime.Now.AddMinutes(20),
                signingCredentials: signinCredentials
            );
            string tokenString = new JwtSecurityTokenHandler().WriteToken(tokeOptions);
            return tokenString;
        }
        private async Task<string> GetRefreshToken(string ip, int userId)
        {
            var refreshToken = GenerateRefreshToken();
            var tokenHash = ComputeSha256Hash(refreshToken);
            var rt = new RefreshToken
            {
                TokenHash = tokenHash,
                Expires = DateTime.UtcNow.AddDays(7),
                CreatedAt = DateTime.UtcNow,
                CreatedByIp = ip,
                UserId = userId,
            };

            await _refreshTokenDao.AddTokenAsync(rt);
            return tokenHash;
        }
        private string GetIpAddress(string ipAddress)
        {
            var ip = ipAddress ?? "Unknown";
            return ip;
        }
        #endregion

    }
}
