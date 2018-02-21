using Euroland.NetCore.AnnualReport.WebApp.Server.Models;
using Euroland.NetCore.ToolsFramework.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Euroland.NetCore.AnnualReport.WebApp.Repositories
{
    public class SearchRepository: RepositoryBase, ISearchRepository
    {
        public SearchRepository(IApplicationDbContext dbContext)
            : base(dbContext) { }
        /// <summary>
        /// Get all featured companies, there will be have 20 featured companies
        /// </summary>
        /// <returns></returns>
        public List<Suggestion> GetListSuggestionCompanyReport(string query, int? year, int top)
        {
            return this.DbContext.Exec<Suggestion>("spCompanyReportSelectSuggestion",new {query, year, top }).ToList();
        }
    }
}
