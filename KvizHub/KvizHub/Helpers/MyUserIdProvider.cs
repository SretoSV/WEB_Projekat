using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace KvizHub.Helpers
{
    public class MyUserIdProvider : IUserIdProvider
    {
        public string GetUserId(HubConnectionContext connection)
        {
            // Ovdje kažeš SignalR-u koji claim predstavlja userId
            // Pošto u JWT dodaješ ClaimTypes.NameIdentifier = user.Id.ToString()
            // vraćaš baš taj claim
            return connection.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        }
    }
}
