using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WPS_worder_node_1.BL;
using WPS_worder_node_1.Modal;
using WPS_worder_node_1.Repositories;
using System.Data;

namespace WPS_worder_node_1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegisterServerController : ControllerBase
    {
        [HttpPost]
        [Route("register")]
        public async Task<Response> RegisterServer(IServerListRepo serverListRepo ,int Client_id, int Server_id, string Server_url)
        {
            // add clentServer to serverListRepo
            serverListRepo.AddServer(new ServerModal { Client_id = Client_id, Server_id = Server_id, Server_url = Server_url });

            //check it's health first 
            HealthCheckerModal healthChecker = await HealthChecker.CheckHealthAsync(Server_url);

            //push metrics to pushgateway
            MyMatricsPusher.PushMetrics(Client_id,Server_id, healthChecker);

            //if error then,
            //send notification to alerting system.

            //preparing Response 
            Response response = new Response()
            {
                StatusCode = 200,
                IsError = false,
            };

            // data to the response
            response.Data = new DataTable();
            response.Data.Columns.Add("StatusCode", typeof(int));
            response.Data.Columns.Add("ErrorMessage", typeof(string));
            response.Data.Columns.Add("IsError", typeof(bool));
            response.Data.Columns.Add("ResponseTime", typeof(int));

            response.Data.Rows.Add(healthChecker.StatusCode, healthChecker.ErrorMessage, healthChecker.IsError, healthChecker.ResponseTime);

            return response;
        }
    }
}
