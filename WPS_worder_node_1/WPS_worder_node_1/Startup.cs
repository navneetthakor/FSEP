using Hangfire;
using Hangfire.MySql;
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

            // Add Hangfire services
            services.AddHangfire(config =>
                config.UseStorage(new MySqlStorage(connectionString, new MySqlStorageOptions
                {
                    TablesPrefix = "Hangfire", // Optional: Prefix for Hangfire tables
                    QueuePollInterval = TimeSpan.FromSeconds(15) // Adjust polling interval
                }))
                ); // Use SQL Server in production
            services.AddHangfireServer();

            //ServerListRepo configuration 
            services.AddSingleton<IServerListRepo, ServerListRepo>();
            services.AddSingleton<IMyJobServices, MyJobServices>();
        }

        public void Configure(WebApplication app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            // Redirect HTTP requests to HTTPS
            app.UseHttpsRedirection();

            // Map incoming requests to controller actions
            app.MapControllers();

            // End the request pipeline 
            app.Run();
        }
    }
}