
using WPS_worder_node_1.Modal;

namespace WPS_worder_node_1.Repositories
{
    public interface IServerListRepo
    {
        List<ServerModal> ListOfServer { get; set; }

        void AddServer(ServerModal server);
    }
}