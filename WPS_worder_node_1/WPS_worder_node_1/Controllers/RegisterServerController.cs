using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WPS_worder_node_1.BL;
using WPS_worder_node_1.Modal;

namespace WPS_worder_node_1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegisterServerController : ControllerBase
    {
        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> RegisterServer(int Client_id, int Server_id, string Server_url)
        {
            HealthCheckerModal healthChecker = await HealthChecker.CheckHealthAsync(Server_url);
            return Ok(healthChecker);
        }
    }
}
