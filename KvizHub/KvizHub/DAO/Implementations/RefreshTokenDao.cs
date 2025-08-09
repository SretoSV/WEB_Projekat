using KvizHub.Context;
using KvizHub.Models;
using Microsoft.EntityFrameworkCore;

namespace KvizHub.DAO.Implementations
{
    public class RefreshTokenDao : IRefreshTokenDao
    {
        private readonly AppDbContext _context;

        public RefreshTokenDao(AppDbContext context)
        {
            _context = context;
        }
        public async Task<RefreshToken> AddTokenAsync(RefreshToken rt)
        {
            _context.RefreshTokens.Add(rt);
            await _context.SaveChangesAsync();
            return rt;
        }
        public async Task<RefreshToken?> GetByTokenHashAsync(string refreshTokenHash)
        {
            return await _context.RefreshTokens.SingleOrDefaultAsync(x => x.TokenHash == refreshTokenHash);
        }

        public async Task RemoveAsync(RefreshToken token)
        {
            _context.RefreshTokens.Remove(token);
            await _context.SaveChangesAsync();
        }
        public async Task<bool> IsTokenActive(string refreshTokenHash)
        {
            if (string.IsNullOrEmpty(refreshTokenHash))
                return false;

            var token = await _context.RefreshTokens
                        .Where(t => t.TokenHash == refreshTokenHash && t.Expires > DateTime.UtcNow)
                        .FirstOrDefaultAsync();

            if (token == null)
                return false;

            if (token.Expires <= DateTime.UtcNow)
                return false;

            return true;
        }
    }
}
