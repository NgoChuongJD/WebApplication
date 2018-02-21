using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Swashbuckle.AspNetCore.Swagger;
using System.Collections.Generic;
using System;
using System.Linq;
using Microsoft.Extensions.Logging;

using Euroland.NetCore.AnnualReport.WebApp.Extensions;
using Euroland.NetCore.ToolsFramework.Mvc.Logging;
using System.Net;
using Microsoft.AspNetCore.Http;

namespace Euroland.NetCore.AnnualReport.WebApp
{
    public class Startup
    {
        // Order or run
        //1) Constructor
        //2) Configure services
        //3) Configure
        
        /// <summary>
        /// Gets the name of the application
        /// </summary>
        public const string ApplicationName = "AnnualReportPromotion";

        /// <summary>
        /// Gets the <see cref="IHostingEnvironment"/>
        /// </summary>
        public static IHostingEnvironment HostingEnv { get; private set; }

        /// <summary>
        /// Gets the <see cref="IConfiguration"/>
        /// </summary>
        public static IConfiguration Configuration { get; private set; }

        private const string EXCEPTION_ON_START_UP = "Startup";
        private const string EXCEPTION_ON_CONFIGURE_SERVICES = "ConfigureServices";
        private Dictionary<string, List<Exception>> _startupExceptions;

        public Startup(IConfiguration configuration, IHostingEnvironment env)
        {
            _startupExceptions = new Dictionary<string, List<Exception>>() {
                { EXCEPTION_ON_START_UP, new List<Exception>() },
                { EXCEPTION_ON_CONFIGURE_SERVICES, new List<Exception>() }
            };
            try
            {
                HostingEnv = env;
                Configuration = configuration;
            }
            catch (Exception ex)
            {
                this._startupExceptions[EXCEPTION_ON_START_UP].Add(ex);
            }
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit http://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            try
            {
                //services.AddCustomHeaders();

                /*if (HostingEnv.IsDevelopment())
                {
                    services.AddSslCertificate(HostingEnv);
                }*/
                services.AddOptions();

                services.AddResponseCompression(options =>
                {
                    options.MimeTypes = Helpers.DefaultMimeTypes;
                });

                services.AddCustomDbContext();

                services.AddCustomIdentity();

                services.AddCustomOpenIddict();

                services.AddMemoryCache();

                services.RegisterCustomServices();

                services.AddCustomLocalization();

                services.AddCustomizedMvc();

                /*
                services.AddSwaggerGen(c =>
                {
                    c.SwaggerDoc("v1", new Info { Title = "AnnualReportPromotion2", Version = "v1" });
                });
                */
            }
            catch (Exception ex)
            {
                this._startupExceptions[EXCEPTION_ON_CONFIGURE_SERVICES].Add(ex);
            }
        }
        public void Configure(IApplicationBuilder app, ILoggerFactory loggerFactory)
        {
            if (HostingEnv.IsDevelopment())
            {
                loggerFactory.AddConsole(Startup.Configuration.GetSection("Logging"));
                loggerFactory.AddDebug();
            }
            else
            {
                loggerFactory.AddMailServiceDatabase(options => {
                    options.ConnectionString = Configuration.GetConnectionString("ErrorLogMailServiceConnectionString");
                    options.CurrentHttpContext = () => app.ApplicationServices.GetRequiredService<IHttpContextAccessor>();
                });
            }

            if (this._startupExceptions.Any(ex => ex.Value.Count > 0))
            {
                var logger = loggerFactory.CreateLogger(ApplicationName);

                app.Run(async context => {
                    context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    context.Response.ContentType = "text/plain";

                    foreach (var ex in this._startupExceptions)
                    {
                        foreach (var val in ex.Value)
                        {
                            logger.LogError($"{ex.Key}:::{val.Message}");
                            await context.Response.WriteAsync($"Error on {ex.Key}: {val.Message}").ConfigureAwait(false);
                        }
                    }
                });
                return;
            }

            //app.UseCustomisedCsp();
            
            //app.UseCustomisedHeadersMiddleware();

            app.AddDevMiddlewares();

            app.UseStaticFiles();

            if (HostingEnv.IsProduction())
            {
                app.UseResponseCompression();
            }

            app.AddCustomLocalization();
            app.UseAuthentication();

            app.UseMvc(routes =>
            {
                // http://stackoverflow.com/questions/25982095/using-googleoauth2authenticationoptions-got-a-redirect-uri-mismatch-error
                // routes.MapRoute(name: "signin-google", template: "signin-google", defaults: new { controller = "Account", action = "ExternalLoginCallback" });

                // Route for: /setLangugage/?culture=en-GB
                routes.MapRoute(name: "set-language", template: "setlanguage", defaults: new { controller = "Home", action = "SetLanguage" });
                
                routes.MapSpaFallbackRoute(name: "spa-fallback", defaults: new { controller = "Home", action = "Index" });
            });
        }

    }
}
