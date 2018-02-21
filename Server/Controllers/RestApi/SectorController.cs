using Euroland.NetCore.AnnualReport.WebApp.Controllers.RestApi;
using Euroland.NetCore.AnnualReport.WebApp.Repositories;
using Euroland.NetCore.AnnualReport.WebApp.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Euroland.NetCore.AnnualReport.WebApp.Controllers
{
    /// <summary>
    /// 
    /// </summary>
    [Route("api/Sectors")]
    public class SectorController : BaseController
    {
        private readonly ISectorRepository _sectorRepository;
        public SectorController(ISectorRepository sectorRepository)
        {
            this._sectorRepository = sectorRepository ?? throw new ArgumentException(nameof(sectorRepository));
        }
        
        /// <summary>
        /// Get all sectors is actived
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [AllowAnonymous]
        public IActionResult GetAll()
        {
            if (!this.HttpContext.User.Identity.IsAuthenticated)
            {
                return Ok(this._sectorRepository.GetList());
            }
            return NotFound();

        }

        /// <summary>
        /// Get all industries
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [AllowAnonymous]
        [Route("industries")]
        public IActionResult GetAllIndustry()
        {
            if (!this.HttpContext.User.Identity.IsAuthenticated)
            {
                return Ok(this._sectorRepository.GetListIndustry());
            }
            return NotFound();

        }
    }
}
