using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using AspNet.Security.OpenIdConnect.Primitives;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System;
using Microsoft.AspNetCore.Mvc.Razor;

using Euroland.NetCore.ToolsFramework.Mvc.Localization;
using Euroland.NetCore.AnnualReport.WebApp.Entities;
using Euroland.NetCore.AnnualReport.WebApp.Filters;
using Euroland.NetCore.AnnualReport.WebApp.Services;
using Microsoft.AspNetCore.Routing;
using Euroland.NetCore.AnnualReport.WebApp.CustomLocalizations;
using Euroland.NetCore.AnnualReport.WebApp.Server.CustomLocalizations;
using Euroland.NetCore.AnnualReport.WebApp.Repositories;

namespace Euroland.NetCore.AnnualReport.WebApp.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddSslCertificate(this IServiceCollection services, IHostingEnvironment hostingEnv)
        {
            // var cert = new X509Certificate2(Path.Combine(hostingEnv.ContentRootPath, "extra", "cert.pfx"), "game123");

            //services.Configure<KestrelServerOptions>(options =>
            //{
            //    options.UseHttps(cert);
            //});

            return services;
        }
        public static IServiceCollection AddCustomizedMvc(this IServiceCollection services)
        {
            services.AddMvc(options =>
            {
                options.Filters.Add(typeof(ModelValidationFilter));
            })
            .AddJsonOptions(options =>
            {
                options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
            })
            .AddViewLocalization(LanguageViewLocationExpanderFormat.Suffix)
            .AddDataAnnotationsLocalization();

            return services;
        }
        public static IServiceCollection AddCustomIdentity(this IServiceCollection services)
        {
            // For api unauthorised calls return 401 with no body
            services.AddIdentity<ApplicationUser, ApplicationRole>(options =>
            {
                options.Password.RequiredLength = 4;
                options.Password.RequireNonAlphanumeric = false;
            })
            .AddEntityFrameworkStores<IdentityDbContext>()
            .AddDefaultTokenProviders();

            return services;
        }
        public static IServiceCollection AddCustomOpenIddict(this IServiceCollection services)
        {
            // Configure Identity to use the same JWT claims as OpenIddict instead
            // of the legacy WS-Federation claims it uses by default (ClaimTypes),
            // which saves you from doing the mapping in your authorization controller.
            services.Configure<IdentityOptions>(options =>
            {
                options.ClaimsIdentity.UserNameClaimType = OpenIdConnectConstants.Claims.Name;
                options.ClaimsIdentity.UserIdClaimType = OpenIdConnectConstants.Claims.Subject;
                options.ClaimsIdentity.RoleClaimType = OpenIdConnectConstants.Claims.Role;
            });

            // Register the OpenIddict services.
            services.AddOpenIddict(options =>
            {
                // Register the Entity Framework stores.
                options.AddEntityFrameworkCoreStores<IdentityDbContext>();

                // Register the ASP.NET Core MVC binder used by OpenIddict.
                // Note: if you don't call this method, you won't be able to
                // bind OpenIdConnectRequest or OpenIdConnectResponse parameters.
                options.AddMvcBinders();

                // Enable the token endpoint.
                // Form password flow (used in username/password login requests)
                options.EnableTokenEndpoint("/connect/token");

                // Enable the authorization endpoint.
                // Form implicit flow (used in social login redirects)
                options.EnableAuthorizationEndpoint("/connect/authorize");

                // Enable the password and the refresh token flows.
                options.AllowPasswordFlow()
                       .AllowRefreshTokenFlow()
                       .AllowImplicitFlow(); // To enable external logins to authenticate

                options.SetAccessTokenLifetime(TimeSpan.FromMinutes(30));
                options.SetIdentityTokenLifetime(TimeSpan.FromMinutes(30));
                options.SetRefreshTokenLifetime(TimeSpan.FromMinutes(60));
                // During development, you can disable the HTTPS requirement.
                options.DisableHttpsRequirement();

                // Note: to use JWT access tokens instead of the default
                // encrypted format, the following lines are required:
                //
                // options.UseJsonWebTokens();
                options.AddEphemeralSigningKey();
            });

            // If you prefer using JWT, don't forget to disable the automatic
            // JWT -> WS-Federation claims mapping used by the JWT middleware:
            //
            // JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();
            // JwtSecurityTokenHandler.DefaultOutboundClaimTypeMap.Clear();
            //
            // services.AddAuthentication()
            //     .AddJwtBearer(options =>
            //     {
            //         options.Authority = "http://localhost:54895/";
            //         options.Audience = "resource_server";
            //         options.RequireHttpsMetadata = false;
            //         options.TokenValidationParameters = new TokenValidationParameters
            //         {
            //             NameClaimType = OpenIdConnectConstants.Claims.Subject,
            //             RoleClaimType = OpenIdConnectConstants.Claims.Role
            //         };
            //     });

            // Alternatively, you can also use the introspection middleware.
            // Using it is recommended if your resource server is in a
            // different application/separated from the authorization server.
            //
            // services.AddAuthentication()
            //     .AddOAuthIntrospection(options =>
            //     {
            //         options.Authority = new Uri("http://localhost:54895/");
            //         options.Audiences.Add("resource_server");
            //         options.ClientId = "resource_server";
            //         options.ClientSecret = "875sqd4s5d748z78z7ds1ff8zz8814ff88ed8ea4z4zzd";
            //         options.RequireHttpsMetadata = false;
            //     });

            services.AddAuthentication(options =>
            {
                // This will override default cookies authentication scheme
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultForbidScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddOAuthValidation();
            // https://console.developers.google.com/projectselector/apis/library?pli=1
            /*.AddGoogle(options =>
            {
                options.ClientId = Startup.Configuration["Authentication:Google:ClientId"];
                options.ClientSecret = Startup.Configuration["Authentication:Google:ClientSecret"];
            })
            // https://developers.facebook.com/apps
            .AddFacebook(options =>
            {
                options.AppId = Startup.Configuration["Authentication:Facebook:AppId"];
                options.AppSecret = Startup.Configuration["Authentication:Facebook:AppSecret"];
            })
            // https://apps.twitter.com/
            .AddTwitter(options =>
            {
                options.ConsumerKey = Startup.Configuration["Authentication:Twitter:ConsumerKey"];
                options.ConsumerSecret = Startup.Configuration["Authentication:Twitter:ConsumerSecret"];
            })
            // https://apps.dev.microsoft.com/?mkt=en-us#/appList
            .AddMicrosoftAccount(options =>
            {
                options.ClientId = Startup.Configuration["Authentication:Microsoft:ClientId"];
                options.ClientSecret = Startup.Configuration["Authentication:Microsoft:ClientSecret"];
            })
            // Note: Below social providers are supported through this open source library:
            // https://github.com/aspnet-contrib/AspNet.Security.OAuth.Providers

            // https://www.linkedin.com/secure/developer?newapp=
            .AddLinkedIn(options =>
            {
                options.ClientId = Startup.Configuration["Authentication:LinkedIn:ClientId"];
                options.ClientSecret = Startup.Configuration["Authentication:LinkedIn:ClientSecret"];

            });*/

            return services;
        }
        public static IServiceCollection AddCustomDbContext(this IServiceCollection services)
        {
            // Add framework services.
            services.AddDbContextPool<IdentityDbContext>(options =>
            {
                options.UseSqlServer(Startup.Configuration.GetConnectionString("AnnualReportPromotionAppDbConnectionString"));
                options.UseOpenIddict();
            });

            services.AddSingleton<IApplicationDbContext>(new ApplicationDbContext(
                Startup.Configuration.GetConnectionString("AnnualReportPromotionAppDbConnectionString"))
            );

            return services;
        }

        public static IServiceCollection AddCustomLocalization(this IServiceCollection services)
        {
            services.Configure<RouteOptions>(options =>
            {
                options.ConstraintMap.Add("lang", typeof(LanguageRouteConstraint));
            });

            // Service for translation generation
            // by calling to URI: /{app}/TranslationGenerator
            services.AddEurolandTranslationService(options => {
                options.ResourcePath = "Translations";
                options.FileName = "Translations.xml";
                options.ConnectionString = Startup.Configuration.GetConnectionString("SharkDbConnectionString");
            });

            // Service for Custom Json Localization
            // where the selected language is saved/detected to/via cookie 
            services.AddEurolandJsonLocalization(
                options => {
                    options.ResourcePath = "Translations";
                    options.RequestCultureFinders.Clear();
                    // Get page language from the route
                    // www.arp.com/:lang/home
                    options.RequestCultureFinders.Add(new CookieRequestCultureFinder());
                }
            );
            
            // Service for view/controller translation 
            services.AddTransient<ITranslation, JsonHtmlLocalizer>();

            return services;
        }
        public static IServiceCollection RegisterCustomServices(this IServiceCollection services)
        {
            // New instance every time, only configuration class needs so its ok
            services.AddTransient<IEmailSender, AuthMessageSender>();

            services.AddTransient<IdentityDbContext>();
            services.AddScoped<UserResolverService>();
            services.AddScoped<DbLoggerExceptionFilter>();
            services.AddScoped<ApiExceptionFilter>();
            services.AddScoped<IReportRepository, ReportRepository>();
            services.AddScoped<ISectorRepository, SectorRepository>();
            services.AddScoped<ICountryRepository, CountryRepository>();
            services.AddScoped<ICompanyRepository, CompanyRepository>();
            services.AddScoped<CountryServices, CountryServices>();
            services.AddScoped<SectorServices, SectorServices>();
            services.AddScoped<ISearchRepository, SearchRepository>();
            return services;
        }

    }
}
