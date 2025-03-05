using ServiceStack.Messaging;
using System.ComponentModel.DataAnnotations;
using wps_master_pod_1.Modal.Enums;

namespace wps_master_pod_1.Modal.POCOS
{
    public class MPD02
    {
        /// <summary>
        /// worker_id
        /// </summary>
        [StringLength(20)]
        public string D02F01;

        /// <summary>
        /// running or push
        /// </summary>
        public WorkerPodStatus D02F03;
    }
}
