using Microsoft.AspNetCore.Mvc;
using wps_master_pod_1.Modal;
using wps_master_pod_1.BL.Interface;
using wps_master_pod_1.BL.Services;

namespace wps_master_pod_1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GateWayController : ControllerBase
    {

        [HttpPost]
        [Route("RegisterApi")]
        /// <summary>
        /// endpoit to register server (used by api gateway)
        /// </summary>
        public Response RegisterApi([FromBody] ServerModal serverModal, [FromServices] IDbUptimeWorker dbUptimeWorker)
        {
            try
            {

                //forward it to the worker pod
                Response response = UptimeWorkerAPIs.RegisterServer(serverModal);
                Console.WriteLine("Response : " + response.Data);

                //if error occured
                if (response.IsError)
                {
                    return response;
                }

                // adding entry to database 
                Response dbResponse = dbUptimeWorker.AddServer(serverModal.Client_id, serverModal.Server_id, "worker_1");

                //if error occured
                if (dbResponse.IsError)
                {
                    return dbResponse;
                }

                //return now 
                return new Response() { Data = null, IsError = false, ErrorMessage = "successfull", StatusCode = 200 };
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error : " + ex.Message);
                return new Response() { Data = null, IsError = true, ErrorMessage = ex.Message, StatusCode = 500 };
            }

        }


        public Response RemoveServer(int client_id, int server_id, [FromServices] IDbUptimeWorker dbUptimeWorker)
        {
            //forward it to the worker pod
            Response response = UptimeWorkerAPIs.RemoveServer(client_id, server_id);
            Console.WriteLine("Response : " + response.Data);

            //if error occured
            if (response.IsError)
            {
                return response;
            }

            // removing entry to database 
            Response dbResponse = dbUptimeWorker.RemoveServer(client_id, server_id);
            //if error occured
            if (dbResponse.IsError)
            {
                return dbResponse;
            }

            //return now 
            return new Response() { Data = null, IsError = false, ErrorMessage = "successfull", StatusCode = 200 };
        }
    }
}
