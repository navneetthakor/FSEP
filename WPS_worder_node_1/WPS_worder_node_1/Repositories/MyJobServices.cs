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
                //check if this server is already under recovery 
                if(server.Status == ServerStatus.Push)
                {
                    continue;
                }

                //check it's health
                HealthCheckerModal healthCheckModal = HealthChecker.CheckHealthAsync(server.Server_url).GetAwaiter().GetResult();

                //if error then notify to kafka 
                if(healthCheckModal.IsError)
                {
                    MyKafkaProducer.NotifyKafka(server, healthCheckModal,false);
                    server.Status = ServerStatus.Push;
                }

                // if no error then push metrics to pushgateway
                MyMatricsPusher.PushMetrics(server.Client_id, server.Server_id, healthCheckModal);
            }
        }
    }
}
