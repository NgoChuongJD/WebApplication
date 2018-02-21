using Euroland.NetCore.AnnualReport.WebApp.Repositories;
using Euroland.NetCore.AnnualReport.WebApp.Server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Euroland.NetCore.AnnualReport.WebApp.Services
{
    public class SectorServices
    {
        private readonly ISectorRepository _sectorRepository;
        public SectorServices(ISectorRepository sectorRepository)
        {
            this._sectorRepository = sectorRepository ?? throw new ArgumentException(nameof(sectorRepository));
        }
        /// <summary>
        /// Get all sectors is active
        /// </summary>
        /// <returns></returns>
        public List<Sector> GetAll()
        {
            return this._sectorRepository.GetList();
        }
    }
}
