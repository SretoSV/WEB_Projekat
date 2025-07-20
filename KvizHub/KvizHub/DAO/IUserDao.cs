using KvizHub.Models;

namespace KvizHub.DAO
{
    public interface IUserDao : ICRUDDao<User, int>
    {
        Task<User> GetByEmailAsync(string email);
    }
}
