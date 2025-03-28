using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WPS_worder_node_1.Modal;

namespace WorkerService1.Modal
{
    internal class KafkaMessageContainer
    {
        /// <summary>
        /// server modal
        /// </summary>
        public ServerModal? serverModal { get; set; }

        /// <summary>
        /// health checker modal
        /// </summary>
        public HealthCheckerModal? healthCheckerModal { get; set; }

        /// <summary>
        /// flow execution result
        /// </summary>
        public FlowExecutionResult? flowExecutionResult { get; set; }

        /// <summary>
        /// Clinet information
        /// </summary>
        public ClientModal? clientModal { get; set; }

        /// <summary>
        /// is this test email.
        /// </summary>
        public TypeOfEmail emailType  { get; set; }

    }

    public enum TypeOfEmail
    {
    EndpointTestEmail,
    EndpointErrorEmail,
    EndpointSuccessEmail,
    APIFlowTestEmail,
    APIFlowErrorEmail,
    APIFlowSuccessEmail
    }
}

