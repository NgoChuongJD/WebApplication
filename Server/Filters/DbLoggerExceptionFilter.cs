using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Euroland.NetCore.AnnualReport.WebApp.Filters
{
    /// <summary>
    /// An class to log error/exception into the database
    /// </summary>
    public class DbLoggerExceptionFilter: ExceptionFilterAttribute
    {
        protected readonly ILogger logger;

        /// <summary>
        /// Creates a new <see cref="DbLoggerExceptionFilter"/>
        /// </summary>
        /// <param name="loggerFactory"></param>
        public DbLoggerExceptionFilter(ILoggerFactory loggerFactory)
        {
            logger = loggerFactory?.CreateLogger(Startup.ApplicationName) ?? throw new ArgumentNullException(nameof(loggerFactory));
        }

        public override void OnException(ExceptionContext context)
        {
            logger.LogError(context.Exception, null);
            base.OnException(context);
        }
    }
}
