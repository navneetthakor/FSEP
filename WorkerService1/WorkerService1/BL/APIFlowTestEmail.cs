using Newtonsoft.Json;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WorkerService1.Modal;
using WPS_worder_node_1.Modal;

namespace WorkerService1.BL
{
    internal class APIFlowTestEmail
    {
        public static EmailContent EmailInfoGetter(ServerModal sm, FlowExecutionResult flowExResult)
        {
            //send request to the user service and get required data.
            //getting data from env
            string userServiceUrl = Environment.GetEnvironmentVariable("MY_USER_SERVICE_URL");

            //create rest client 
            RestClient client = new RestClient(userServiceUrl);

            //new request to serve 
            RestRequest request = new RestRequest($"alert/apiFlow", Method.Get);
            request.AddQueryParameter("client_id", sm.Client_id);
            request.AddQueryParameter("flow_id", sm.flow_id);

            //executing request 
            RestResponse rr = client.Execute(request);

            Response? response = JsonConvert.DeserializeObject<Response>(rr.Content);

            ClientModal cm = response.Other;

            //Preparing jsong data to send along with emnail 
            string executedNodes = JsonConvert.SerializeObject(flowExResult.ExecutedNodes);
            string nodeResults = JsonConvert.SerializeObject(flowExResult.NodeResults);

            //provide proper info 
            return new EmailContent
            {
                To = cm.Client_email,
                Subject = $"Test email for API flow {cm.API_flow_name}!!!",
                Body = $"Hello {cm.Client_name},<br><br>This is TEST email for your Endpoint {cm.API_flow_name}.  <br> For your reference it is returning following: <br> executed nodes: {executedNodes} <br> executed nodes result: {nodeResults} <br><br> <br> Regards, <br> WebPulse Stack"
            };
        }


    }
}
