using Newtonsoft.Json;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;
using WorkerService1.Modal;
using WPS_worder_node_1.Modal;

namespace WorkerService1.BL
{
    internal class APIFlowErrorEmail
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
            string errors = JsonConvert.SerializeObject(flowExResult.Errors);
            string nodeResults = JsonConvert.SerializeObject(flowExResult.NodeResults);

            //provide proper info 
            return new EmailContent
            {
                To = cm.Client_email,
                Subject = $"Unwanted Incident Reported for API flow {cm.API_flow_name}!!!",
                Body = $"Hello {cm.Client_name},<br><br>Your are receiving this email becuase your API flow {cm.API_flow_name} faced unwanted event. so please resolve it and reactivate checking when you done. <br> For your reference it is returning following: <br> executed nodes: {executedNodes} <br> executed nodes result: {nodeResults} <br> Errors that we received: {errors} <br> <br> Regards, <br> WebPulse Stack"
            };
        }

    }
}
