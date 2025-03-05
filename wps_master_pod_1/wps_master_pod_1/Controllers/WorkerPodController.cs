using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using wps_master_pod_1.BL.Services;
using wps_master_pod_1.Modal;
using wps_master_pod_1.Repositories;

namespace wps_master_pod_1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WorkerPodController : ControllerBase
    {
        private DbMPD02 _dbConnection;
        WorkerPodController([FromServices] IDataBaseService dataBaseSevice)
        {
            _dbConnection = new DbMPD02(dataBaseSevice);
        }

        [HttpGet]
        [Route("HeartBeat")]
        public Response HeartBeat([FromServices] IStackStore stackStore ,string worker_id)
        {
            try
            {
                //try to update the worker pod status in Database first 
                Response response = _dbConnection.AcknowledgeServer(worker_id);

                if(response.IsError)
                {
                    //if error occured then push this to stackStore 
                    //so that it can be processed later
                    stackStore.AddWorker(worker_id);
                }
                    return response;
            }
            catch (Exception ex)
            {
                return new Response { Data = null, ErrorMessage = ex.Message, IsError = true };
            }
        }

    }
}
