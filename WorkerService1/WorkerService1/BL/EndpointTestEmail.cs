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
    internal class EndpointTestEmail
    {
        public static EmailContent EmailInfoGetter(ServerModal sm, HealthCheckerModal hcm)
        {
            //send request to the user service and get required data.
            //getting data from env
            string userServiceUrl = Environment.GetEnvironmentVariable("MY_USER_SERVICE_URL");

            //create rest client 
            RestClient client = new RestClient(userServiceUrl);

            //new request to serve 
            RestRequest request = new RestRequest($"alert/endpoint", Method.Get);
            request.AddQueryParameter("client_id", sm.Client_id);
            request.AddQueryParameter("server_id", sm.Server_id);

            //executing request 
            RestResponse rr = client.Execute(request);

            Response? response = JsonConvert.DeserializeObject<Response>(rr.Content);

            ClientModal cm = response.Other;

            //provide proper info 
            return new EmailContent
            {
                To = cm.Client_email,
                Subject = $"Test email for {cm.Endpoint_name}!!!",
                Body = $"Hello {cm.Client_name},<br><br>This is TEST email for your Endpoint {cm.Endpoint_name}. <br> It is returning following: <br> status code: {hcm.StatusCode} <br> response time: {hcm.ResponseTime} <br> Message: {hcm.ErrorMessage} <br> <br> Regards, <br> WebPulse Stack"
            };
        }
    }
}
