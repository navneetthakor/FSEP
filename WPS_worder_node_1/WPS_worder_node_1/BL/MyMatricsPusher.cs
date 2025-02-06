using Microsoft.AspNetCore.Http;
using Prometheus.Client;
using Prometheus.Client.Collectors;
using Prometheus.Client.MetricPusher;
using System;
using WPS_worder_node_1.Modal;

namespace WPS_worder_node_1.BL
{
    public class MyMatricsPusher
    {
        // ✅ Static registry & pusher (prevents memory leak)
        private static readonly CollectorRegistry registry = new CollectorRegistry();
        private static readonly MetricFactory factory = new MetricFactory(registry);
        private static readonly IHistogram jobExecutionDuration = factory.CreateHistogram(
            "http_response_time_custom", "Response time in seconds"
        );
        private static readonly IMetricFamily<ICounter, ValueTuple<String>> jobExecutionStatus = factory.CreateCounter(
            "http_status_code_custom", "Count of HTTP status codes", "status_code"
        );

        public static void PushMetrics(int Clinet_id, int Server_id, HealthCheckerModal healthCheckModal)
        {
            // ✅ Move pusher here (after defining registry & metrics)
            var pusher = new MetricPusher(new MetricPusherOptions
            {
                Endpoint = "http://localhost:9091",
                Job = $"{Clinet_id}",
                Instance = $"{Server_id}",
                CollectorRegistry = registry  // ✅ Attach registry
            });

            // ✅ Push collected metrics
            jobExecutionDuration.Observe(healthCheckModal.ResponseTime);
            jobExecutionStatus.WithLabels(healthCheckModal.StatusCode.ToString()).Inc();

            // ✅ Await PushAsync to ensure data is sent before method exits
            pusher.PushAsync().GetAwaiter().GetResult();

            Console.WriteLine("Response time & status code pushed successfully!");
        }
    }
}




