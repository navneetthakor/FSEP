using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WorkerService1.Modal
{
    internal class ClientModal
    {
        /// <summary>
        /// Client id (unique id for this client)
        /// </summary>
        public int Client_id { get; set; }

        /// <summary>
        /// Client name (name of the client)
        /// </summary>
        public string Client_name { get; set; }

        /// <summary>
        /// Client email (email of the client)
        /// </summary>
        public string Client_email { get; set; }

        /// <summary>
        /// API flow name
        /// </summary>
        public string? API_flow_name { get; set; }

        /// <summary>
        /// Endpoint name
        /// </summary>
        public string? Endpoint_name { get; set; }
    }
}
