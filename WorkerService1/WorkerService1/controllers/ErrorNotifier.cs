using Confluent.Kafka;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WorkerService1.BL;
using WorkerService1.Modal;

namespace WorkerService1.controllers
{
    internal class ErrorNotifier
    {
        public static void NotifyError(ConsumeResult<Ignore, string> consumeResult)
        {
            //string to object 
            KafkaMessageContainer? kafkaMessageContainer = JsonConvert.DeserializeObject<KafkaMessageContainer>(consumeResult?.Message.Value);

            //preparing content for email 
            EmailContent emailContent;

            if (kafkaMessageContainer.isTestEmail)
            {
                emailContent = TestEmailFormatter.EmailInfoGetter(kafkaMessageContainer.serverModal, kafkaMessageContainer.healthCheckerModal);
            }
            else
            {
            emailContent = EmailFormatter.EmailInfoGetter(kafkaMessageContainer.serverModal, kafkaMessageContainer.healthCheckerModal);
            }

            //sending email 
            MyMailer.sendEmail(emailContent);
        }
    }
}
