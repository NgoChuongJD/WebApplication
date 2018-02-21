using Euroland.NetCore.AnnualReport.WebApp.Server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Euroland.NetCore.AnnualReport.WebApp.Repositories
{
    public interface ISearchRepository
    {
        List<Suggestion> GetListSuggestionCompanyReport(string query, int? year, int top);
    }
}
