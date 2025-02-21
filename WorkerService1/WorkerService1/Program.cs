using DotNetEnv;
using WorkerService1;

Env.Load($"{Directory.GetCurrentDirectory()}/.env");

HostApplicationBuilder builder = Host.CreateApplicationBuilder(args);
builder.Services.AddHostedService<Worker>();

IHost host = builder.Build();
host.Run();
