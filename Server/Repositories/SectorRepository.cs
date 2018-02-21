using Euroland.NetCore.AnnualReport.WebApp.Server.Models;
using Euroland.NetCore.ToolsFramework.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Euroland.NetCore.AnnualReport.WebApp.Repositories
{
    public class SectorRepository:RepositoryBase,ISectorRepository
    {
        public SectorRepository(IApplicationDbContext dbContext) 
            : base(dbContext){}
        /// <summary>
        /// Get all sectors is active
        /// </summary>
        /// <returns></returns>
        public List<Sector> GetList()
        {
            return this.DbContext.Exec<Sector>("spSectorSelect").ToList();
        }

        /// <summary>
        /// Get all industries
        /// </summary>
        /// <returns></returns>
        public List<Industry> GetListIndustry()
        {
            return this.DbContext.Exec<Industry>("spIndustrySelect").ToList();
        }
    }
}
