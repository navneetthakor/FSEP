using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WorkerService1.Modal
{
    internal class EmailContent
    {
        /// <summary>
        /// Email address of the recipient
        /// </summary>
        public string To { get; set; }

        /// <summary>
        /// Subject of the email
        /// </summary>
        public string Subject { get; set; }

        /// <summary>
        /// Body of the email
        /// </summary>
        public string Body { get; set; }
    }
}
