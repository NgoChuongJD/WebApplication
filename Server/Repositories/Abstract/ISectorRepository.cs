using Euroland.NetCore.AnnualReport.WebApp.Server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Euroland.NetCore.AnnualReport.WebApp.Repositories
{
    public interface ISectorRepository
    {
        /// <summary>
        /// Get all sectors is active
        /// </summary>
        /// <returns></returns>
        List<Sector> GetList();

        /// <summary>
        /// Get all industries
        /// </summary>
        /// <returns></returns>
        List<Industry> GetListIndustry();
    }
}
