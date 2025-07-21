using KvizHub.DTO;
using KvizHub.Models;

namespace KvizHub.DAO
{
    public interface IUserDao : ICRUDDao<User, int>
    {
        Task<User> GetUserByUsernameOrEmailAsync(string email);
        Task<bool> UserExists(string email, string username);
        Task<bool> RegisterUser(User user);
    }
}
