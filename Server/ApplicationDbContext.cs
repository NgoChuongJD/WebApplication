using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Euroland.NetCore.ToolsFramework.Data;

namespace Euroland.NetCore.AnnualReport.WebApp
{
    /// <summary>
    /// Implements the utility methods for querying data against database by using Store Procedures
    /// </summary>
    public interface IApplicationDbContext: IDatabaseContext { }

    /// <summary>
    /// The database context of application used to query data against AnnualReportPromotionApp database.
    /// </summary>
    public class ApplicationDbContext: Euroland.NetCore.ToolsFramework.Data.DapperDatabaseContext, IApplicationDbContext
    {
        /// <summary>
        /// Creates an instance of <see cref="ApplicationDbContext"/>
        /// </summary>
        /// <param name="connectionString">The connection string to AnnualReportPromotionApp database</param>
        public ApplicationDbContext(string connectionString) : base(connectionString)
        {

        }
    }
}
