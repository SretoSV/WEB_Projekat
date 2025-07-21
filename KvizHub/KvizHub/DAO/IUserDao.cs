using KvizHub.DTO;
using KvizHub.Models;

namespace KvizHub.DAO
{
    public interface IUserDao : ICRUDDao<User, int>
    {
        Task<User> GetUserByUsernameOrEmailAsync(string email);
        Task<bool> UserExistsByUsername(string username);
        Task<bool> UserExistsByEmail(string parameter);
        Task<bool> RegisterUser(User user);
    }
}
