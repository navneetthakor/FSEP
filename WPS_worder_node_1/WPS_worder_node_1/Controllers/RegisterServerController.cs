using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WPS_worder_node_1.BL;
using WPS_worder_node_1.Modal;
using WPS_worder_node_1.Repositories;

namespace WPS_worder_node_1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegisterServerController : ControllerBase
    {
        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> RegisterServer(IServerListRepo serverListRepo ,int Client_id, int Server_id, string Server_url)
        {
            serverListRepo.AddServer(new ServerModal { Client_id = Client_id, Server_id = Server_id, Server_url = Server_url });
            HealthCheckerModal healthChecker = await HealthChecker.CheckHealthAsync(Server_url);
            MyMatricsPusher.PushMetrics(Client_id,Server_id, healthChecker);
            return Ok(healthChecker);
        }
    }
}
