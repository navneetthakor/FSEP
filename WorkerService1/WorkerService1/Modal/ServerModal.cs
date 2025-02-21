namespace WPS_worder_node_1.Modal
{
    public class ServerModal
    {
        /// <summary>
        /// Client id (who owns this server)
        /// </summary>
        public int Client_id { get; set; }

        /// <summary>
        /// server id (unique id for this server)
        /// </summary>
        public int Server_id { get; set; }

        /// <summary>
        /// server url (url of the server)
        /// </summary>
        public string Server_url { get; set; }

    }
}
