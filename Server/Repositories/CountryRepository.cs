using Euroland.NetCore.AnnualReport.WebApp.Models;
using Euroland.NetCore.ToolsFramework.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Euroland.NetCore.AnnualReport.WebApp.Repositories
{
    public class CountryRepository:RepositoryBase,ICountryRepository
    {
        public CountryRepository(IApplicationDbContext dbContext)
            : base(dbContext) { }

        /// <summary>
        /// Get all countries is active
        /// </summary>
        /// <returns></returns>
        public List<Country> GetList()
        {
            return this.DbContext.Exec<Country>("spCountrySelect").ToList();
        }

        /// <summary>
        /// Get all exchange
        /// </summary>
        /// <returns></returns>
        public List<Exchange> GetListExchange()
        {
            return this.DbContext.Exec<Exchange>("spExchangeSelect").ToList();
        }

    }
}
