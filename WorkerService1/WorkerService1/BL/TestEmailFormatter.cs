using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WorkerService1.Modal;
using WPS_worder_node_1.Modal;

namespace WorkerService1.BL
{
    internal class TestEmailFormatter
    {
        public static EmailContent EmailInfoGetter(ServerModal sm, HealthCheckerModal hcm)
        {
            //send request to the user service and get below data.
            ClientModal cm = new ClientModal()
            {
                Client_id = 1,
                Client_name = "Navneet",
                Client_email = "codewithnavneet@gmail.com",
            };

            // make another request and get name of the server
            string serverName = "CI Moguls";

            //provide proper info 
            return new EmailContent
            {
                To = cm.Client_email,
                Subject = $"Test email for {serverName}!!!",
                Body = $"Hello {cm.Client_name},<br><br>This is TEST email for your server {serverName}. <br> It is returning following: <br> status code: {hcm.StatusCode} <br> response time: {hcm.ResponseTime} <br> Message: {hcm.ErrorMessage} <br> <br> Regards, <br> WebPulse Stack"
            };
        }
    }
}
