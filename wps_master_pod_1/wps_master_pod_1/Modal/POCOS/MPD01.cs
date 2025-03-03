using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

namespace wps_master_pod_1.Modal.POCOS
{
    [Table("server_worker_map")]
    public class MPD01
    {
        /// <summary>
        /// Clinet_id (who owns this server)
        /// </summary>
        [NotNull]
        public int D01F01;

        /// <summary>
        /// server id (unique id for this server)
        /// </summary>
        [NotNull]
        public int D01F02;

        /// <summary>
        /// worker_id
        /// </summary>
        [StringLength(20)]
        public string? D01F03;
    }
}
