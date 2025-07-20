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
        private readonly PasswordHasher<string> passwordHasher = new PasswordHasher<string>();

        public UserService(IConfiguration config, IUserDao userDao, IMapper mapper)
        {
            _secretKey = config.GetSection("SecretKey");
            _userDao = userDao;
            _mapper = mapper;
        }

        public async Task<UserLoginResponseDto> Login(LoginUserDto dto)
        {
            User user = await _userDao.GetByEmailAsync(dto.Email);

            if (user == null)
                return null;

            var result = passwordHasher.VerifyHashedPassword(null, user.PasswordHash, dto.Password);


            if (result == PasswordVerificationResult.Success)//Uporedjujemo hes pasvorda iz baze i unetog pasvorda
            {
                List<Claim> claims = new List<Claim>();
                //Mozemo dodati Claimove u token, oni ce biti vidljivi u tokenu i mozemo ih koristiti za autorizaciju
                if (dto.Email == "anaanic@gmail.com")
                    claims.Add(new Claim(ClaimTypes.Role, "admin")); //Add user type to claim
                else
                    claims.Add(new Claim(ClaimTypes.Role, "user")); //Add user type to claim

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
    }
}
