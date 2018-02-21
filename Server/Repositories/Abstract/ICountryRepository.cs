using Euroland.NetCore.AnnualReport.WebApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Euroland.NetCore.AnnualReport.WebApp.Repositories
{
    public interface ICountryRepository
    {
        /// <summary>
        /// Get all countries is active
        /// </summary>
        /// <returns></returns>
        List<Country> GetList();

        /// <summary>
        /// Get all exchanges
        /// </summary>
        /// <returns></returns>
        List<Exchange> GetListExchange();
    }
}
