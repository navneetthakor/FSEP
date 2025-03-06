using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WPS_worder_node_1.BL;
using WPS_worder_node_1.Modal;
using System.Data;
using WPS_worder_node_1.Repositories.Interface;

namespace WPS_worder_node_1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MasterPodController : ControllerBase
    {
        [HttpPost]
        [Route("register")]
        public async Task<Response> RegisterServer(IServerListRepo serverListRepo, [FromBody] ServerModal serverModal)
        {
            try
            {
                // add clentServer to serverListRepo
                serverListRepo.AddServer(serverModal);

                //check it's health first 
                HealthCheckerModal healthChecker = await HealthChecker.CheckHealthAsync(serverModal);

                //push metrics to pushgateway
                MyMatricsPusher.PushMetrics(serverModal.Client_id, serverModal.Server_id, healthChecker);

                //if error then,
                //send notification to alerting system.
                if (healthChecker.IsError)
                {
                    MyKafkaProducer.NotifyKafka(serverModal, healthChecker, false);
                }
                // testing notification
                else
                {
                    MyKafkaProducer.NotifyKafka(serverModal, healthChecker, true);
                }

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
            catch (Exception ex)
            {
                Response response = new Response()
                {
                    StatusCode = 500,
                    IsError = true,
                    ErrorMessage = ex.Message
                };
                return response;
            }
        }


        [HttpDelete]
        [Route("remove/{client_id}/{server_id}")]
        public Response RemoveServer(IServerListRepo serverlistRepo, int client_id, int server_id)
        {
            try
            {
                // remove server from serverListRepo
                serverlistRepo.RemoveServer(client_id, server_id);

                //preparing Response 
                Response response = new Response()
                {
                    StatusCode = 200,
                    IsError = false,
                    ErrorMessage = "Server removed successfully"
                };

                return response;
            }
            catch (Exception ex)
            {
                Response response = new Response()
                {
                    StatusCode = 500,
                    IsError = true,
                    ErrorMessage = ex.Message
                };
                return response;
            }
        }

        [HttpGet]
        [Route("getHeartBit")]
        public Response GetHeartBit()
        {
            return new Response() { IsError = false };
        }
    }
}
