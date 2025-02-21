using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MailKit.Security;
using MimeKit;
using MailKit.Net.Smtp;
using WorkerService1.Modal;


namespace WorkerService1.BL
{
    internal class MyMailer
    {

        public static void sendEmail(EmailContent emailContent)
        {
            //getting data from env
            string appPassword = Environment.GetEnvironmentVariable("APP_PASSWORDS");
            string senderEmail = Environment.GetEnvironmentVariable("MY_EMAIL");

            //preparing email to sent 
            MimeMessage email = new MimeMessage();
            email.From.Add(new MailboxAddress("WebPulse Stack", senderEmail));
            email.To.Add(new MailboxAddress("", emailContent.To));
            email.Subject = emailContent.Subject;
            email.Body = new TextPart("html") { Text = emailContent.Body };

            //setting up smtp server 
            using SmtpClient smtp = new SmtpClient();
            smtp.Connect("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
            smtp.Authenticate(senderEmail, appPassword);
            smtp.Send(email);
            smtp.Disconnect(true);
        }

    }
}
