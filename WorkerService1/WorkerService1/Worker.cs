using Confluent.Kafka;
using Newtonsoft.Json;
using WorkerService1.BL;
using WorkerService1.controllers;
using WorkerService1.Modal;

namespace WorkerService1
{
    public class Worker : BackgroundService
    {
        private readonly ILogger<Worker> _logger;

        public Worker(ILogger<Worker> logger)
        {
            _logger = logger;
        }

        protected override Task ExecuteAsync(CancellationToken stoppingToken)
        {
            ConsumerConfig config = new ConsumerConfig
            {
                BootstrapServers = "localhost:9092",
                GroupId = "email-consumers",
                AutoOffsetReset = AutoOffsetReset.Earliest
            };

            using IConsumer<Ignore,string> consumer = new ConsumerBuilder<Ignore, string>(config).Build();

            consumer.Subscribe("email-Notifier");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    // waiting for kafka message event
                    ConsumeResult<Ignore,string> consumeResult = consumer.Consume();

                    //sending email 
                    EmailNotifier.NotifyError(consumeResult);

                    // logging info
                    _logger.LogInformation($"Consumed message '{consumeResult?.Message.Value}' at: '{consumeResult.Offset}'");

                }
                catch (Exception e)
                {
                    _logger.LogError($"Error : {e.Message}");
                }
            }

            return Task.CompletedTask;
        }

    }
}
