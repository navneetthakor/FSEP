﻿using Hangfire;
using Hangfire.SqlServer;
using WPS_worder_node_1.Repositories;
namespace WPS_worder_node_1
{
    /// <summary>
    /// Class responsible for configuring the application during startup. 
    /// </summary>
    public class Startup
    {
        /// <summary>
        /// Configuration property containing the application's configuration
        /// </summary>
        public IConfiguration Configuration { get; set; }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen();

            string connectionString = "Server=localhost;Database=hangfire_db;Uid=root;Pwd=N@vneet2810;"; // Connection string to the database

            // 1. Configure Hangfire storage (e.g., SQL Server, Redis)
            services.AddHangfire(configuration => configuration
                .SetDataCompatibilityLevel(CompatibilityLevel.Version_170)
                .UseSimpleAssemblyNameTypeSerializer()
                .UseRecommendedSerializerSettings()
                .UseSqlServerStorage(Configuration.GetConnectionString("HangfireConnection"))); // Or UseRedisStorage, etc

            services.AddHangfireServer();

            //ServerListRepo configuration 
            services.AddSingleton<IServerListRepo, ServerListRepo>();
            services.AddSingleton<IMyJobServices, MyJobServices>();

            
        }

        public void Configure(WebApplication app, IWebHostEnvironment env, IRecurringJobManager recurringJobManager)
        {
            // Schedule a recurring job that pushes metrics
            IMyJobServices job = app.Services.GetRequiredService<IMyJobServices>();
            recurringJobManager.AddOrUpdate("Checking-health", () => job.InvokCheck(), Cron.Minutely);

            if (env.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            // Redirect HTTP requests to HTTPS
            app.UseHttpsRedirection();

            // Enable Hangfire Dashboard (optional)
            app.UseHangfireDashboard("/hangfire");

            // Map incoming requests to controller actions
            app.MapControllers();


            // End the request pipeline 
            app.Run();
        }
    }
}