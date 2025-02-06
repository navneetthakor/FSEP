using WPS_worder_node_1.Modal;

namespace WPS_worder_node_1.Repositories
{
    public class ServerListRepo : IServerListRepo
    {
        public List<ServerModal> ListOfServer { get; set; }

        public ServerListRepo()
        {
            ListOfServer = new List<ServerModal>();
        }

        public void AddServer(ServerModal server)
        {
            ListOfServer.Add(server);
        }
    }
}
