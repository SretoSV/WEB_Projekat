using KvizHub.Models;

namespace KvizHub.DAO
{
    public interface IRefreshTokenDao
    {
        Task<RefreshToken> AddTokenAsync(RefreshToken rt);
        Task<RefreshToken?> GetByTokenHashAsync(string refreshTokenHash);
        Task RemoveAsync(RefreshToken token);
        Task<bool> IsTokenActive(string refreshToken);

    }
}
