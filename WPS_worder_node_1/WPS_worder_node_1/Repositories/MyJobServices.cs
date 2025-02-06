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

        }
    }
}
