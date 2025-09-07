using KvizHub.DTO;
using KvizHub.Models;

namespace KvizHub.DAO
{
    public interface IUserDao : ICRUDDao<User, int>
    {
        Task<User> GetUserByUsernameOrEmailAsync(string email);
        Task<User> GetUserByIdAsync(int id);
        Task<bool> UserExistsByUsername(string username);
        Task<bool> UserExistsByEmail(string parameter);
        Task<bool> RegisterUser(User user);
        Task<List<string>> GetAllUsersUsernames();
        Task<List<string>> GetUserUsernamesByUserIds(List<int> ids);
        Task<List<User>> GetAllUsersByUsersIds(List<int> userIds);
        Task<int> GetUserIdByUsername(string username);
    }
}
