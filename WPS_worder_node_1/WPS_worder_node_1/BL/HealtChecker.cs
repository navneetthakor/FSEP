using System;
using System.Diagnostics;
using System.Threading.Tasks;
using RestSharp;
using WPS_worder_node_1.Modal;

namespace WPS_worder_node_1.BL
{
    public class HealthChecker
    {
        public static async Task<HealthCheckerModal> CheckHealthAsync(string url)
        {
            RestClient client = new RestClient();
            RestRequest request = new RestRequest(url, Method.Get);
            Stopwatch stopwatch = Stopwatch.StartNew();

            HealthCheckerModal healthChecker = new HealthCheckerModal();

            try
            {
                RestResponse response = await client.ExecuteAsync(request);
                stopwatch.Stop();

                healthChecker.StatusCode = (int)response.StatusCode;
                healthChecker.ResponseTime = (int)stopwatch.ElapsedMilliseconds;

                if ((int)response.StatusCode == 0 || (int)response.StatusCode >= 300)
                {
                    healthChecker.IsError = true;
                    healthChecker.ErrorMessage = response.ErrorException?.Message;
                }
                Console.WriteLine("rs: " + healthChecker.ResponseTime);
                Console.WriteLine("st: " + healthChecker.StatusCode);
                return healthChecker;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Request failed: {ex.Message}");
                healthChecker.IsError = true;
                healthChecker.ErrorMessage = ex.Message;
                healthChecker.StatusCode = -1;
                return healthChecker;
            }
        }
    }
}
