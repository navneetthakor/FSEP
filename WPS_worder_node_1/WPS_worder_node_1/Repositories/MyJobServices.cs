using WPS_worder_node_1.BL;
using WPS_worder_node_1.Modal;

namespace WPS_worder_node_1.Repositories
{
    public class MyJobServices : IMyJobServices
    {
        private IServerListRepo _serverListRepo { get; set; }
        public MyJobServices(IServerListRepo serverListRepo)
        {
            _serverListRepo = serverListRepo;
        }

        public void InvokCheck()
        {
            Console.WriteLine("Invoking Health Check");
            foreach (ServerModal server in _serverListRepo.ListOfServer)
            {
                HealthCheckerModal healthCheckModal = HealthChecker.CheckHealthAsync(server.Server_url).GetAwaiter().GetResult();
                MyMatricsPusher.PushMetrics(server.Client_id, server.Server_id, healthCheckModal);
            }
            Console.WriteLine("Invoking Health Check");
        }
    }
}
