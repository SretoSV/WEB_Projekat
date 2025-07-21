using KvizHub.Context;
using KvizHub.DTO;
using KvizHub.Models;
using Microsoft.EntityFrameworkCore;

namespace KvizHub.DAO.Implementations
{
    public class UserDao : IUserDao
    {
        private readonly AppDbContext _context;

        public UserDao(AppDbContext context)
        {
            _context = context;
        }
        #region CRUD
        public int Count()
        {
            throw new NotImplementedException();
        }

        public int Delete(User entity)
        {
            throw new NotImplementedException();
        }

        public int DeleteAll()
        {
            throw new NotImplementedException();
        }

        public int DeleteById(int id)
        {
            throw new NotImplementedException();
        }

        public bool ExistsById(int id)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<User> FindAll()
        {
            throw new NotImplementedException();
        }

        public IEnumerable<User> FindAllById(IEnumerable<int> ids)
        {
            throw new NotImplementedException();
        }

        public User FindById(int id)
        {
            throw new NotImplementedException();
        }


        public int Save(User entity)
        {
            throw new NotImplementedException();
        }

        public int SaveAll(IEnumerable<User> entities)
        {
            throw new NotImplementedException();
        }
        #endregion

        public async Task<User> GetUserByUsernameOrEmailAsync(string usernameOrEmail)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == usernameOrEmail || u.Username == usernameOrEmail);
        }
        public async Task<bool> UserExists(string email, string username)
        {
            return await _context.Users
                .AnyAsync(u => u.Email == email || u.Username == username);
        }

        public async Task<bool> RegisterUser(User user)
        {
            try
            {
                _context.Users.Add(user);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return false;
            }
        }
    }
}
